import * as http from 'http';
import { Server } from 'socket.io';
import { ENEMY_ATTACK_AVATAR_RANGE, AVATAR_ATTACK_ENEMY_RANGE } from "./Constants";
import { HANDLE_GENERATE_NEW_ENEMY, HANDLE_GENERATE_NEW_ITEM, HANDLE_COLLECT_ITEM, HANDLE_ENEMIES_MOVE_TOWARDS_AVATAR, HANDLE_ENEMIES_ATTACK_AVATAR, HANDLE_AVATAR_ATTACK_ENEMIES, HANDLE_USER_KEY_DOWN, HANDLE_USER_KEY_UP, HANDLE_MOVE_AVATAR, UPDATE } from "./Events";
import httpApp from "./httpApp";
import avatarStateManager from "./states/AvatarStateManager";
import enemiesStateManager from "./states/EnemyStateManager";
import gameStateManager from "./states/GameStateManager";
import itemsStateManager from "./states/ItemStateManager";
import tilingStateManager from "./states/TilingStateManager";

const server = http.createServer(httpApp);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateData(data: any, callback: (data: any) => void) {
    const room = data.room;
    if (!room) {
        return; // Abort if room is null
    }

    const avatarId = data.avatarId;
    if (!avatarId || !avatarStateManager.getAvatarById(room, avatarId)) {
        return; // Abort if avatarId is invalid
    }

    // If valid, invoke the callback
    callback(data);
}

io.on('connection', (socket) => {
    socket.on('joinRoom', (data) => {
        if (data.room) {
            const room = data.room;
            // Join the specified room
            socket.join(room);
            avatarStateManager.addAvatar(room, socket.id);
        }
        socket.data.room = data.room;
    });

    socket.on('disconnect', () => {
        avatarStateManager.removeAvatar(socket.data.room, socket.id);
        socket.leave(socket.data.room);
    });

    socket.on(HANDLE_GENERATE_NEW_ENEMY, (data) => {
        enemiesStateManager.addEnemy(data.room);
        broadcast(data.room);
    });

    socket.on(HANDLE_GENERATE_NEW_ITEM, (data) => {
        itemsStateManager.addItem();
        broadcast(data.room);
    })

    socket.on(HANDLE_COLLECT_ITEM, (data) => {
        validateData(data, (data) => {
            const avatarId = data.avatarId;
            const items = itemsStateManager.getItems();
            const avatar = avatarStateManager.getAvatarById(data.room, avatarId);
            Object.keys(items).forEach((key) => {
                const item = items[key];
                if (avatar.isCollidedWith(item)) {
                    if (item.getType() === 'bomb') {
                        enemiesStateManager.destroyAllEnemies();
                    }
                    // TODO handle consume potion
                    itemsStateManager.consumeItem(key);
                }
            });
            broadcast(data.room);
        })
    })

    socket.on(HANDLE_ENEMIES_MOVE_TOWARDS_AVATAR, (data) => {
        const enemiesMap = enemiesStateManager.getEnemies(data.room);
        // TODO make enemy move towards the avatar whose client created the enemy
        const firstAvatar = avatarStateManager.getFirstAvatar(data.room);
        if (firstAvatar == null) {
            return;
        }
        Object.keys(enemiesMap).forEach((key) => {
            const enemy = enemiesMap[key];
            enemy.moveTowardsAvatar(firstAvatar.getX(), firstAvatar.getY());
        });
        broadcast(data.room);
    });

    socket.on(HANDLE_ENEMIES_ATTACK_AVATAR, (data) => {
        const enemiesMap = enemiesStateManager.getEnemies(data.room);
        const avatarsMap = avatarStateManager.getAvatars(data.room);
        Object.keys(avatarsMap).forEach((avatarKey) => {
            const avatar = avatarsMap[avatarKey];
            Object.keys(enemiesMap).forEach((key) => {
                const enemy = enemiesMap[key];
                if (enemy === undefined) {
                    return;
                }
                if (enemy.isCollidedWith(avatar, ENEMY_ATTACK_AVATAR_RANGE)) {
                    avatar.collide();
                }
            });
        });
        broadcast(data.room);
    })

    socket.on(HANDLE_AVATAR_ATTACK_ENEMIES, (data) => {
        validateData(data, (data) => {
            const avatarId = data.avatarId;
            const enemiesMap = enemiesStateManager.getEnemies(data.room);
            const avatar = avatarStateManager.getAvatarById(data.room, avatarId);

            Object.keys(enemiesMap).forEach((key) => {
                const enemy = enemiesMap[key];
                if (enemy === undefined) {
                    return;
                }
                if (enemy.isCollidedWith(avatar, AVATAR_ATTACK_ENEMY_RANGE)) {
                    enemiesStateManager.killEnemy(data.room, key);
                }
            });
            broadcast(data.room);
        })
    })

    socket.on(HANDLE_USER_KEY_DOWN, (data, callback?: (() => void) | null) => {
        validateData(data, (data) => {
            const key = data.key as string;
            const avatarId = data.avatarId as string;
            const moveKeyTriggered = activateAvatarMoveKey(data.room, avatarId, key);
            if (moveKeyTriggered) {
                onComplete(callback);
                return;
            }

            if (activateMenuToggle(key)) {
                onComplete(callback);
                return;
            }

            return;
        });
    });

    socket.on(HANDLE_USER_KEY_UP, (data, callback?: (() => void) | null) => {
        validateData(data, (data) => {
            const key = data.key as string;
            const avatarId = data.avatarId as string;
            const avatarKeys = avatarStateManager.getAvatarActionById(data.room, avatarId);
            if (key in avatarKeys) {
                avatarKeys[key] = false;
            }
            onComplete(callback);
        });
    });

    socket.on(HANDLE_MOVE_AVATAR, async (data) => {
        validateData(data, (data) => {
            const avatarId = data.avatarId;
            const avatar = avatarStateManager.getAvatarById(data.room, avatarId);
            const avatarKeys = avatarStateManager.getAvatarActionById(data.room, avatarId);
            if (avatarKeys.ArrowLeft) {
                avatar.moveLeft();
            }
            if (avatarKeys.ArrowRight) {
                avatar.moveRight();
            }
            if (avatarKeys.ArrowUp) {
                avatar.moveUp();
            }
            if (avatarKeys.ArrowDown) {
                avatar.moveDown();
            }
        });

    })
});

function onComplete(callback?: (() => void) | null) {
    if (callback) {
        callback();
    }
};

/* return true if moveKey is triggered otherwise false*/
function activateAvatarMoveKey(room: string, avatarId: string, moveKey: string) :boolean {
    const avatarKeys = avatarStateManager.getAvatarActionById(room, avatarId);
    if (moveKey in avatarKeys) {
        avatarKeys[moveKey] = true;
        return true;
    }
    return false
}

function activateMenuToggle(key: string) :boolean {
    if (key === 'm' || key === 'M') {
        gameStateManager.toggle();
        return true;
    }
    return false;
}

function broadcast(room: string) {
    io.to(room).emit(UPDATE, {
        'enemies': enemiesStateManager.serialize(room),
        'avatars': avatarStateManager.serialize(room),
        'items': itemsStateManager.serialize(),
        'tilings': tilingStateManager.serialize(),
        'gameStopped': gameStateManager.gameStopped(),
    });
}


type GameStateSnapShot = {
    [key: string]: unknown;
};

export {io, server, GameStateSnapShot};