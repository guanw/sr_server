import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import enemiesStateManager from './states/EnemyStateManager';
import { Avatar } from './entity/Avatar';
import { itemsStateManager } from './states/ItemStateManager';
import { ENEMY_ATTACK_AVATAR_RANGE, AVATAR_ATTACK_ENEMY_RANGE } from './Constants';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const avatarKeys: { [key: string]: boolean } = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
};

const avatar = new Avatar();
app.get('/', (req, res) => {
    const enemies = JSON.stringify(enemiesStateManager.serialize());
    const serializedAvatar = JSON.stringify(avatar.serialize());
    const items = JSON.stringify(itemsStateManager.serialize());
    res.send(`
        <h1>debugging info</h1>
        <p>enemies: ${enemies}</p>
        <p>avatar: ${serializedAvatar}</p>
        <p>items: ${items}</p>
    `);
});



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
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
        Object.keys(items).forEach((key) => {
            const item = items[key];
            if (avatar.isCollidedWith(item)) {
                if (item.getType() === 'bomb') {
                    enemiesStateManager.destroyAllEnemies();
                }
                itemsStateManager.consumeItem(key);
            }

        });
        broadcast();
    })

    socket.on('handleEnemiesMoveTowardsAvatar', () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        Object.keys(enemiesMap).forEach((key) => {
            const enemy = enemiesMap[key];
            enemy.moveTowardsAvatar(avatar.getX(), avatar.getY());
        });
        broadcast();
    });

    socket.on('handleEnemiesAttackAvatar', () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        Object.keys(enemiesMap).forEach((key) => {
            const enemy = enemiesMap[key];
            if (enemy === undefined) {
                return;
            }
            if (enemy.isCollidedWith(avatar, ENEMY_ATTACK_AVATAR_RANGE)) {
                avatar.collide();
            }
        });
        broadcast();
    })

    socket.on('handleAvatarAttackEnemiesEvent', () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        const user = avatar;
        Object.keys(enemiesMap).forEach((key) => {
            const enemy = enemiesMap[key];
            if (enemy === undefined) {
                return;
            }
            if (enemy.isCollidedWith(user, AVATAR_ATTACK_ENEMY_RANGE)) {
                enemiesStateManager.killEnemy(key);
            }
        });
        broadcast();
    })

    socket.on('handleUserKeyDown', (data) => {
        const key = data.key as string;
        handleKeyDown(key);
    });

    socket.on('handleUserKeyUp', (data) => {
        const key = data.key as string;
        handleKeyUp(key);
    });

    socket.on('handleMoveAvatar', async () => {
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

function handleKeyDown(key: string) {
    if (key in avatarKeys) {
        avatarKeys[key] = true;
    }
    // TODO Handle other keys for menu, debug tool, etc.
}

function handleKeyUp(key: string) {
    if (key in avatarKeys) {
        avatarKeys[key] = false;
    }
    // TODO Handle other key up events
}

function broadcast() {
    io.emit('update', {
        'enemies': enemiesStateManager.serialize(),
        'avatar': avatar.serialize(),
        'items': itemsStateManager.serialize()
    });
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});