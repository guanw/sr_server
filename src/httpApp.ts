import express, {Request, Response} from 'express';
import enemiesStateManager from './states/EnemyStateManager';
import avatarStateManager from './states/AvatarStateManager';
import itemsStateManager from './states/ItemStateManager';

export const BACKGROUND_TILE_URL = 'https://guanw.github.io/sr_assets/environment/ground/1.png';
export const ENEMY_URL = 'https://guanw.github.io/sr_assets/slime_run.png';
export const AVATAR_URL = 'https://guanw.github.io/sr_assets/avatar.png';
export const BOMB_URL = 'https://guanw.github.io/sr_assets/bomb.png';
export const WIND_URL = 'https://guanw.github.io/sr_assets/smoke/px_5.png';
export const POTION_URL = 'https://guanw.github.io/sr_assets/items/Potion01.png';

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
        'background_tile_url': BACKGROUND_TILE_URL,
        'enemy_url': ENEMY_URL,
        'avatar_url': AVATAR_URL,
        'wind_url': WIND_URL,
        'bomb_url': BOMB_URL,
        'potion_url': POTION_URL,
    })
})


export default httpApp;

