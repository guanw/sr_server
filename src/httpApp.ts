import express, {Request, Response} from 'express';
import enemiesStateManager from './states/EnemyStateManager';
import avatarStateManager from './states/AvatarStateManager';
import itemsStateManager from './states/ItemStateManager';

export const BACKGROUND_TILE_URL = 'https://guanw.github.io/sr_assets/environment/ground/1.png';

const httpApp = express();
httpApp.get('/', (_req: Request, res: Response) => {
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

httpApp.get('/setup', (_req: Request, res: Response) => {
    res.json({
        'background_tile_url': BACKGROUND_TILE_URL
    })
})


export default httpApp;

