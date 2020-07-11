import { logger } from './utils/log';

import './style/room.scss';

logger('Hello World from room main file!');

const p = document.createElement('p');
p.textContent = '/room';

document.body.appendChild(p);
