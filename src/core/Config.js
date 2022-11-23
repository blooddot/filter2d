import { renderUnsharpmask } from "../image/adjust/unsharpmask/unsharpmask.js";
import { renderLensblur } from "../image/blur/lensblur/lensblur.js";
import { renderTiltshift } from "../image/blur/tiltshift/tiltshift.js";
import { renderTriangleblur } from "../image/blur/triangleblur/triangleblur.js";
export const renderCfgMap = new Map([
    ["lensblur", renderLensblur],
    ["tiltshift", renderTiltshift],
    ["unsharpmask", renderUnsharpmask],
    ["triangleblur", renderTriangleblur],
]);
