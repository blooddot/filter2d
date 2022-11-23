import { renderDefault } from "../../image.js";
const defaultVertexPath = "../../default/default.vs";
export function renderTiltshift(app, name, uniformsData) {
    const { startX: [startX], startY: [startY], endX: [endX], endY: [endY], blurRadius: [blurRadius], gradientRadius: [gradientRadius] } = uniformsData;
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
