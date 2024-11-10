import { CLEANUP_INTERVAL } from './Constants';
import {server} from './socketIOServer';
import avatarStateManager from './states/AvatarStateManager';

server.listen(3000, '0.0.0.0', () => {
    console.log('listening on *:3000');

    startCleanupInterval();
});

function startCleanupInterval() {
    setInterval(() => {
        console.log(`Running cleanup every ${CLEANUP_INTERVAL/1000} seconds`);
        const rooms = avatarStateManager.getAllRooms();
        rooms.forEach((room) => {
            cleanUpDeadAvatars(room);
        })
      }, CLEANUP_INTERVAL);
}

function cleanUpDeadAvatars(roomName: string) {
    const avatarsMap = avatarStateManager.getAvatars(roomName);
    Object.keys(avatarsMap).forEach((avatarKey) => {
        const avatar = avatarsMap[avatarKey];
        if (avatar.getHp() <= 0) {
            avatarStateManager.removeAvatar(roomName, avatarKey);
        }
    });
}