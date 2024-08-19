import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import enemiesStateManager from './states/EnemyStateManager';
import { Avatar } from './entity/Avatar';


export const ENEMY_ATTACK_AVATAR_RANGE = 5;
export const AVATAR_ATTACK_ENEMY_RANGE = 7;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('<h1>health check OK</h1>');
});

const avatar = new Avatar();

function broadcast() {
    io.emit('update', {'enemies': enemiesStateManager.serialize(), 'avatar': avatar.serialize()});
}
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('handleGenerateNewEnemy', () => {
        enemiesStateManager.addEnemy();
        broadcast();
    });

    socket.on('handleEnemiesMoveTowardsAvatar', () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        for (const key in enemiesMap) {
            const enemy = enemiesMap[key];
            enemy.moveTowardsAvatar(avatar.getX(), avatar.getY());
        }
        broadcast();
    });

    socket.on('handleEnemiesAttackAvatar', () => {
        const enemiesMap = enemiesStateManager.getEnemies();
        for (const key in enemiesMap) {
            const enemy = enemiesMap[key];
            if (enemy === undefined) {
                return;
            }
            if (enemy.isCollidedWith(avatar, ENEMY_ATTACK_AVATAR_RANGE)) {
                avatar.collide();
                io.emit('update', {'enemies': enemiesStateManager.serialize(), 'avatar': avatar.serialize()})
            }
        }
        broadcast();
    })

    // socket.on('handleAvatarAttackEnemiesEvent', () => {
    //     const enemiesMap = enemiesStateManager.getEnemies();
    //     const user = avatar;
    //     for (const key in enemiesMap) {
    //         const enemy = enemiesMap[key];
    //         if (enemy === undefined) {
    //             return;
    //         }
    //         if (enemy.isCollidedWith(user, AVATAR_ATTACK_ENEMY_RANGE)) {
    //             enemiesStateManager.killEnemy(key);
    //             broadcast();
    //         }
    //     };
    // })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});