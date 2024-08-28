const express = require('express');
const http = require('http');
import { Server } from 'socket.io';
import enemiesStateManager from './states/EnemyStateManager';
import { Avatar } from './entity/Avatar';
import { itemsStateManager } from './states/ItemStateManager';


export const ENEMY_ATTACK_AVATAR_RANGE = 15;
export const AVATAR_ATTACK_ENEMY_RANGE = 17;
const AVATAR_SPEED = 3;

const avatarKeys: { [key: string]: boolean } = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
  };

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const avatar = new Avatar();
app.get('/', (req, res) => {
    const enemies = JSON.stringify(enemiesStateManager.serialize());
    const serializedAvatar = JSON.stringify(avatar.serialize());
    res.send(`<h1>health check OK</h1><p>${enemies}</p><p>${serializedAvatar}</p>`);
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

    socket.on('handleEnemiesMoveTowardsAvatar', () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        Object.keys(enemiesMap).forEach((key) => {
            const enemy = enemiesMap[key];
            enemy.moveTowardsAvatar(avatar.getX(), avatar.getY());
            enemiesMap[key] = enemy;
        })
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
        // Handle avatar movement based on the key pressed
        const key = data.key as string;
        handleKeyDown(key);
        broadcast();
    });

    socket.on('handleUserKeyUp', (data) => {
        // Handle stopping avatar movement
        const key = data.key as string;
        handleKeyUp(key);
        broadcast();
    });

    socket.on('handleMoveAvatar', async (data) => {
        if (avatarKeys.ArrowLeft) {
            await genMoveUserLeft();
          }
          if (avatarKeys.ArrowRight) {
            await genMoveUserRight();
          }
          if (avatarKeys.ArrowUp) {
            await genMoveUserUp();
          }
          if (avatarKeys.ArrowDown) {
            await genMoveUserDown();
          }
    })

});

function broadcast() {
    io.emit('update', {'enemies': enemiesStateManager.serialize(), 'avatar': avatar.serialize(), 'items': itemsStateManager.serialize()});
}

server.listen(3000, () => {
    console.log('listening on *:3000');
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

async function genMoveUserLeft(moveSpeedOffset = 1) {
    avatar.setDeltaX(-moveSpeedOffset * AVATAR_SPEED);
}

async function genMoveUserRight(moveSpeedOffset = 1) {
    avatar.setDeltaX(moveSpeedOffset * AVATAR_SPEED);
}

async function genMoveUserUp(moveSpeedOffset = 1) {
    avatar.setDeltaY(-moveSpeedOffset * AVATAR_SPEED);
}

async function genMoveUserDown(moveSpeedOffset = 1) {
    avatar.setDeltaY(moveSpeedOffset * AVATAR_SPEED);
}