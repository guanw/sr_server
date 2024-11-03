import express, {Request, Response} from 'express';
import cors from 'cors';
import enemiesStateManager from './states/EnemyStateManager';
import avatarStateManager from './states/AvatarStateManager';
import itemsStateManager from './states/ItemStateManager';
import tilingStateManager from './states/TilingStateManager';
import gameStateManager from './states/GameStateManager';

export const BACKGROUND_TILE_URL = 'https://guanw.github.io/sr_assets/environment/ground/1.png';
export const ENEMY_URL = 'https://guanw.github.io/sr_assets/slime_run.png';
export const AVATAR_URL = 'https://guanw.github.io/sr_assets/avatar.png';
export const BOMB_URL = 'https://guanw.github.io/sr_assets/bomb.png';
export const WIND_URL = 'https://guanw.github.io/sr_assets/smoke/px_5.png';
export const POTION_URL = 'https://guanw.github.io/sr_assets/items/Potion01.png';
export const BASE_TILING_URL = 'https://guanw.github.io/sr_assets/environment/ground/1.png';
export const RANDOM_TILING_URL = 'https://guanw.github.io/sr_assets/environment/ground/3.png';
export const PILLAR_TOP_TILING_URL = "https://guanw.github.io/sr_assets/environment/pillar/1.png";
export const PILLAR_MIDDLE_TILING_URL = "https://guanw.github.io/sr_assets/environment/pillar/2.png";
export const PILLAR_BOTTOM_TILING_URL = "https://guanw.github.io/sr_assets/environment/pillar/3.png";

const httpApp = express();
httpApp.use(cors());

// TODO enable re-randomization of static tiling

httpApp.get('/', (_req: Request, res: Response) => {
    const enemies = JSON.stringify(enemiesStateManager.serialize());
    const avatars = JSON.stringify(avatarStateManager.serialize());
    const items = JSON.stringify(itemsStateManager.serialize());
    const tilings = JSON.stringify(tilingStateManager.serialize());
    const gameStopped = gameStateManager.gameStopped();
    res.send(`
        <h1>debugging info</h1>
        <p>is game stopped: ${gameStopped} </p>
        <p>enemies: ${enemies}</p>
        <p>avatar: ${avatars}</p>
        <p>items: ${items}</p>
        <p>tilings: ${tilings}$
    `);
});

httpApp.get('/setup', (_req: Request, res: Response) => {
    const tilings = tilingStateManager.serialize();
    res.json({
        'assets': {
            'background_tile_url': BACKGROUND_TILE_URL,
            'enemy_url': ENEMY_URL,
            'avatar_url': AVATAR_URL,
            'wind_url': WIND_URL,
            'bomb_url': BOMB_URL,
            'potion_url': POTION_URL,
            'base_tiling_url': BASE_TILING_URL,
            'random_tiling_url': RANDOM_TILING_URL,
            'pillar_top_tiling_url': PILLAR_TOP_TILING_URL,
            'pillar_middle_tiling_url': PILLAR_MIDDLE_TILING_URL,
            'pillar_bottom_tiling_url': PILLAR_BOTTOM_TILING_URL,
        },
        'tilings': tilings,
    })
})


export default httpApp;

