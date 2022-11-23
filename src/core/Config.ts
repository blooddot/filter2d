import { renderUnsharpmask } from "../image/adjust/unsharpmask/unsharpmask.js";
import { renderLensblur } from "../image/blur/lensblur/lensblur.js";
import { renderTiltshift } from "../image/blur/tiltshift/tiltshift.js";
import { renderTriangleblur } from "../image/blur/triangleblur/triangleblur.js";
import App from "./App";

export const renderCfgMap: Map<string, (app: App, name: string, uniformsData?: TUniformsData) => void> = new Map([
    ["lensblur", renderLensblur],
    ["tiltshift", renderTiltshift],
    ["unsharpmask", renderUnsharpmask],
    ["triangleblur", renderTriangleblur],
]) 
