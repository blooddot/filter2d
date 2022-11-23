import App from "../../../core/App.js";
import { renderDefault } from "../../image.js";
const defaultVertexPath = "../../default/default.vs";

export function renderTiltshift(app: App, name: string, uniformsData: TUniformsData) {
    const { startX: [startX], startY: [startY], endX: [endX], endY: [endY], blurRadius: [blurRadius], gradientRadius: [gradientRadius] } = uniformsData as unknown as { startX: [number], startY: [number], endX: [number], endY: [number], blurRadius: [number], gradientRadius: [number] };
    const dx = endX - startX;
    const dy = endY - startY;
    const d = Math.sqrt(dx * dx + dy * dy);

    renderDefault(app, name, {
        u_BlurRadius: [blurRadius],
        u_GradientRadius: [gradientRadius],
        u_Start: [[startX, startY]],
        u_End: [[endX, endY]],
        u_Delta: [[dx / d, dy / d]],
        u_TexSize: [[app.stage.width, app.stage.height]],
    }, defaultVertexPath);

    renderDefault(app, name, {
        u_BlurRadius: [blurRadius],
        u_GradientRadius: [gradientRadius],
        u_Start: [[startX, startY]],
        u_End: [[endX, endY]],
        u_Delta: [[-dy / d, dx / d]],
        u_TexSize: [[app.stage.width, app.stage.height]],
    }, defaultVertexPath);
}