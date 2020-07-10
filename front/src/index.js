import { logger } from "./utils/log";

logger("Hello World from index main file!");

const p = document.createElement("p");
p.textContent = "/index";

document.body.appendChild(p);
