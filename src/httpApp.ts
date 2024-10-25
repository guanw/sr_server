import express, {Request, Response} from 'express';
import enemiesStateManager from './states/EnemyStateManager';
import avatarStateManager from './states/AvatarStateManager';
import itemsStateManager from './states/ItemStateManager';
import { TILING, Tiling } from './entity/Tiling';
import { SAND_TILING_COUNT, PILLAR_TILING_COUNT } from './Constants';

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
// TODO enable re-randomization of static tiling
const tilings_location = [];
for (let i = 0; i < SAND_TILING_COUNT; i++) {
    tilings_location.push(new Tiling(TILING.SAND));
}
for (let i = 0; i < PILLAR_TILING_COUNT; i++) {
    tilings_location.push(new Tiling(TILING.PILLAR));
}

httpApp.get('/', (_req: Request, res: Response) => {
    const enemies = JSON.stringify(enemiesStateManager.serialize());
    const avatars = JSON.stringify(avatarStateManager.serialize());
    const items = JSON.stringify(itemsStateManager.serialize());
    res.send(`
        <h1>debugging info</h1>
        <p>enemies: ${enemies}</p>
        <p>avatar: ${avatars}</p>
        <p>items: ${items}</p>
        <p>tilings_location: ${JSON.stringify(tilings_location)}$
    `);
});

httpApp.get('/setup', (_req: Request, res: Response) => {
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
        'tilings_location': tilings_location,
    })
})


export default httpApp;

