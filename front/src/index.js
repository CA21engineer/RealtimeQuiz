import { logger } from './utils/log';

import './style/index.scss';

logger('Hello World from index main file!');

const p = document.createElement('p');
p.textContent = '/index';

document.body.appendChild(p);
