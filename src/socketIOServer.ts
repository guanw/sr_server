import * as http from 'http';
import { Server } from 'socket.io';
import { ENEMY_ATTACK_AVATAR_RANGE, AVATAR_ATTACK_ENEMY_RANGE } from "./Constants";
import { HANDLE_GENERATE_NEW_ENEMY, HANDLE_GENERATE_NEW_ITEM, HANDLE_COLLECT_ITEM, HANDLE_ENEMIES_MOVE_TOWARDS_AVATAR, HANDLE_ENEMIES_ATTACK_AVATAR, HANDLE_AVATAR_ATTACK_ENEMIES, HANDLE_USER_KEY_DOWN, HANDLE_USER_KEY_UP, HANDLE_TOGGLE_GAME_PLAY, HANDLE_MOVE_AVATAR, UPDATE } from "./Events";
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
function validateAvatarId(data: any, callback: (data: any) => void) {
    const avatarId = data.avatarId;
    if (!avatarId || !avatarStateManager.getAvatarById(avatarId)) {
        return; // Abort if avatarId is invalid
    }

    // If valid, invoke the callback with avatarId
    callback(data);
}

io.on('connection', (socket) => {
    console.log('a user connected');
    avatarStateManager.addAvatar(socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        avatarStateManager.removeAvatar(socket.id);
    });

    socket.on(HANDLE_GENERATE_NEW_ENEMY, () => {
        enemiesStateManager.addEnemy();
        broadcast();
    });

    socket.on(HANDLE_GENERATE_NEW_ITEM, () => {
        itemsStateManager.addItem();
        broadcast();
    })

    socket.on(HANDLE_COLLECT_ITEM, (data) => {
        validateAvatarId(data, (data) => {
            const avatarId = data.avatarId;
            const items = itemsStateManager.getItems();
            const avatar = avatarStateManager.getAvatarById(avatarId);
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
            broadcast();
        })
    })

    socket.on(HANDLE_ENEMIES_MOVE_TOWARDS_AVATAR, () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        // TODO make enemy move towards the avatar whose client created the enemy
        const firstAvatar = avatarStateManager.getFirstAvatar();
        if (firstAvatar == null) {
            return;
        }
        Object.keys(enemiesMap).forEach((key) => {
            const enemy = enemiesMap[key];
            enemy.moveTowardsAvatar(firstAvatar.getX(), firstAvatar.getY());
        });
        broadcast();
    });

    socket.on(HANDLE_ENEMIES_ATTACK_AVATAR, () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        const avatarsMap = avatarStateManager.getAvatars();
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
        broadcast();
    })

    socket.on(HANDLE_AVATAR_ATTACK_ENEMIES, (data) => {
        validateAvatarId(data, (data) => {
            const avatarId = data.avatarId;
            const enemiesMap = enemiesStateManager.getEnemies();
            const avatar = avatarStateManager.getAvatarById(avatarId);

            Object.keys(enemiesMap).forEach((key) => {
                const enemy = enemiesMap[key];
                if (enemy === undefined) {
                    return;
                }
                if (enemy.isCollidedWith(avatar, AVATAR_ATTACK_ENEMY_RANGE)) {
                    enemiesStateManager.killEnemy(key);
                }
            });
            broadcast();
        })
    })

    socket.on(HANDLE_USER_KEY_DOWN, (data) => {
        validateAvatarId(data, (data) => {
            const key = data.key as string;
            const avatarId = data.avatarId as string;
            const avatarKeys = avatarStateManager.getAvatarActionById(avatarId);
            if (avatarKeys == undefined || avatarKeys == null) {
                return;
            }
            if (key in avatarKeys) {
                avatarKeys[key] = true;
            }
        });
    });

    socket.on(HANDLE_USER_KEY_UP, (data) => {
        validateAvatarId(data, (data) => {
            const key = data.key as string;
            const avatarId = data.avatarId as string;
            const avatarKeys = avatarStateManager.getAvatarActionById(avatarId);
            if (avatarKeys == undefined || avatarKeys == null) {
                return;
            }
            if (key in avatarKeys) {
                avatarKeys[key] = false;
            }
        });
    });

    socket.on(HANDLE_TOGGLE_GAME_PLAY, async() => {
        gameStateManager.toggle();
        broadcast();
    })

    socket.on(HANDLE_MOVE_AVATAR, async (data) => {
        validateAvatarId(data, (data) => {
            const avatarId = data.avatarId;
            const avatar = avatarStateManager.getAvatarById(avatarId);
            const avatarKeys = avatarStateManager.getAvatarActionById(avatarId);
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

function broadcast() {
    io.emit(UPDATE, {
        'enemies': enemiesStateManager.serialize(),
        'avatars': avatarStateManager.serialize(),
        'items': itemsStateManager.serialize(),
        'tilings': tilingStateManager.serialize(),
        'gameStopped': gameStateManager.gameStopped(),
    });
}


type GameStateSnapShot = {
    [key: string]: unknown;
};

export {io, server, GameStateSnapShot};