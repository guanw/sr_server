import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import enemiesStateManager from './states/EnemyStateManager';
import { itemsStateManager } from './states/ItemStateManager';
import { ENEMY_ATTACK_AVATAR_RANGE, AVATAR_ATTACK_ENEMY_RANGE } from './Constants';
import avatarStateManager from './states/AvatarStateManager';


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



io.on('connection', (socket) => {
    console.log('a user connected');
    avatarStateManager.addAvatar(socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected');
        avatarStateManager.removeAvatar(socket.id);
    });

    socket.on('handleGenerateNewEnemy', () => {
        enemiesStateManager.addEnemy();
        broadcast();
    });

    socket.on('handleGenerateNewItem', () => {
        itemsStateManager.addItem();
        broadcast();
    })

    socket.on('handleCollectItem', () => {
        const items = itemsStateManager.getItems();
        const avatars = avatarStateManager.getAvatars();
        Object.keys(avatars).forEach((avatarKey) => {
            const avatar = avatars[avatarKey];
            Object.keys(items).forEach((key) => {
                const item = items[key];
                if (avatar.isCollidedWith(item)) {
                    if (item.getType() === 'bomb') {
                        enemiesStateManager.destroyAllEnemies();
                    }
                    itemsStateManager.consumeItem(key);
                }
            });
        })

        broadcast();
    })

    socket.on('handleEnemiesMoveTowardsAvatar', () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        const firstAvatar = avatarStateManager.getFirstAvatar();
        Object.keys(enemiesMap).forEach((key) => {
            const enemy = enemiesMap[key];
            enemy.moveTowardsAvatar(firstAvatar.getX(), firstAvatar.getY());
        });
        broadcast();
    });

    socket.on('handleEnemiesAttackAvatar', () => {
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

    socket.on('handleAvatarAttackEnemiesEvent', () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        const avatarsMap = avatarStateManager.getAvatars();
        Object.keys(avatarsMap).forEach((avatarKey) => {
            const user = avatarsMap[avatarKey];
            Object.keys(enemiesMap).forEach((key) => {
                const enemy = enemiesMap[key];
                if (enemy === undefined) {
                    return;
                }
                if (enemy.isCollidedWith(user, AVATAR_ATTACK_ENEMY_RANGE)) {
                    enemiesStateManager.killEnemy(key);
                }
            });
        });
        broadcast();
    })

    socket.on('handleUserKeyDown', (data) => {
        const key = data.key as string;
        const id = data.id as string;
        handleKeyDown(id, key);
    });

    socket.on('handleUserKeyUp', (data) => {
        const key = data.key as string;
        const id = data.id as string;
        handleKeyUp(id, key);
    });

    socket.on('handleMoveAvatar', async (id: string) => {
        const avatar = avatarStateManager.getAvatars()[id];
        const avatarKeys = avatarStateManager.getAvatarActionMap()[id];
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
    })
});

function handleKeyDown(id: string, key: string) {
    const avatarKeys = avatarStateManager.getAvatarActionMap()[id];
    if (key in avatarKeys) {
        avatarKeys[key] = true;
    }
    // TODO Handle other keys for menu, debug tool, etc.
}

function handleKeyUp(id: string, key: string) {
    const avatarKeys = avatarStateManager.getAvatarActionMap()[id];
    if (key in avatarKeys) {
        avatarKeys[key] = false;
    }
    // TODO Handle other key up events
}

function broadcast() {
    io.emit('update', {
        'enemies': enemiesStateManager.serialize(),
        'avatars': avatarStateManager.serialize(),
        'items': itemsStateManager.serialize()
    });
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});