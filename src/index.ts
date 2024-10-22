import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import enemiesStateManager from './states/EnemyStateManager';
import itemsStateManager from './states/ItemStateManager';
import { ENEMY_ATTACK_AVATAR_RANGE, AVATAR_ATTACK_ENEMY_RANGE, CLEANUP_INTERVAL } from './Constants';
import avatarStateManager from './states/AvatarStateManager';
import { HANDLE_AVATAR_ATTACK_ENEMIES, HANDLE_COLLECT_ITEM, HANDLE_ENEMIES_ATTACK_AVATAR, HANDLE_ENEMIES_MOVE_TOWARDS_AVATAR, HANDLE_GENERATE_NEW_ENEMY, HANDLE_GENERATE_NEW_ITEM, HANDLE_MOVE_AVATAR, HANDLE_USER_KEY_DOWN, HANDLE_USER_KEY_UP, UPDATE } from './Events';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (_req, res) => {
    const enemies = JSON.stringify(enemiesStateManager.serialize());
    const avatars = JSON.stringify(avatarStateManager.serialize());
    const items = JSON.stringify(itemsStateManager.serialize());
    res.send(`
        <h1>debugging info</h1>
        <p>enemies: ${enemies}</p>
        <p>avatar: ${avatars}</p>
        <p>items: ${items}</p>
    `);
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
        'items': itemsStateManager.serialize()
    });
}

server.listen(3000, () => {
    console.log('listening on *:3000');

    startCleanupInterval();
});

function startCleanupInterval() {
    setInterval(() => {
        console.log(`Running cleanup every ${CLEANUP_INTERVAL/1000} seconds`);
        cleanUpDeadAvatars();
      }, CLEANUP_INTERVAL);
}

function cleanUpDeadAvatars() {
    const avatarsMap = avatarStateManager.getAvatars();
    Object.keys(avatarsMap).forEach((avatarKey) => {
        const avatar = avatarsMap[avatarKey];
        if (avatar.getHp() <= 0) {
            avatarStateManager.removeAvatar(avatarKey);
        }
    });
}