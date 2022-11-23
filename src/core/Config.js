import { renderUnsharpmask } from "../image/adjust/unsharpMask/unsharpMask.js";
import { renderLensblur } from "../image/blur/lensBlur/lensBlur.js";
import { renderTiltshift } from "../image/blur/tiltShift/tiltShift.js";
import { renderTriangleblur } from "../image/blur/triangleBlur/triangleBlur.js";
export const renderCfgMap = new Map([
    ["lensBlur", renderLensblur],
    ["tiltShift", renderTiltshift],
    ["unsharpMask", renderUnsharpmask],
    ["triangleBlur", renderTriangleblur],
]);
