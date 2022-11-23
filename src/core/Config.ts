import { renderUnsharpmask } from "../image/adjust/unsharpMask/unsharpMask.js";
import { renderLensblur } from "../image/blur/lensBlur/lensBlur.js";
import { renderTiltshift } from "../image/blur/tiltShift/tiltShift.js";
import { renderTriangleblur } from "../image/blur/triangleblur/triangleBlur.js";
import App from "./App";

export const renderCfgMap: Map<string, (app: App, name: string, uniformsData?: TUniformsData) => void> = new Map([
    ["lensblur", renderLensblur],
    ["tiltshift", renderTiltshift],
    ["unsharpmask", renderUnsharpmask],
    ["triangleblur", renderTriangleblur],
]);
