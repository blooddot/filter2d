import { renderUnsharpmask } from "../image/adjust/unsharpMask/unsharpMask.js";
import { renderLensblur } from "../image/blur/lensBlur/lensBlur.js";
import { renderTiltshift } from "../image/blur/tiltShift/tiltShift.js";
import { renderTriangleblur } from "../image/blur/triangleBlur/triangleBlur.js";
import App from "./App";

export const renderCfgMap: Map<string, (app: App, name: string, uniformsData?: TUniformsData) => void> = new Map([
    ["lensBlur", renderLensblur],
    ["tiltShift", renderTiltshift],
    ["unsharpMask", renderUnsharpmask],
    ["triangleBlur", renderTriangleblur],
]);
