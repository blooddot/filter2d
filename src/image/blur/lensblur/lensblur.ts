import App from "../../../core/App.js";
import { clamp } from "../../../utils/util.js";
import { renderDefault } from "../../image.js";

export function renderLensblur(app: App, name: string, uniformsData: TUniformsData) {
    const { radius: [radius], brightness: [brightness], angle: [angle] } = uniformsData as unknown as { radius: [number], brightness: [number], angle: [number] };
    const dir: [number, number][] = [];
    for (let i = 0; i < 3; i++) {
        const a = angle + i * Math.PI * 2 / 3;
        dir.push([radius * Math.sin(a) / app.stage.width, radius * Math.cos(a) / app.stage.height]);
    }
    const power = Math.pow(10, clamp(-1, brightness, 1));
    const defaultVertexPath = "../../default/default.vs";

    // Remap the texture values, which will help make the bokeh effect
    renderDefault(app, "lensBlurPrePass", {
        u_Power: [power]
    }, defaultVertexPath, "lensBlurPrePass.fs");

    // Blur two rhombi in parallel into extraTexture
    app.stage.extraTexture.ensureFormat(app.stage.texture);
    renderDefault(app, "lensBlur0", {
        u_Delta0: [dir[0]]
    }, defaultVertexPath, "lensBlur0.fs", app.stage.texture, app.stage.extraTexture);
    renderDefault(app, "lensBlur1", {
        u_Delta0: [dir[1]],
        u_Delta1: [dir[2]]
    }, defaultVertexPath, "lensBlur1.fs", app.stage.extraTexture, app.stage.extraTexture);

    // Blur the last rhombus and combine with extraTexture
    renderDefault(app, "lensBlur0", {
        u_Delta0: [dir[1]]
    }, defaultVertexPath, "lensBlur0.fs");
    app.stage.extraTexture.use(1);
    renderDefault(app, "lensBlur2", {
        u_Power: [1 / power],
        u_Delta0: [dir[2]]
    }, defaultVertexPath, "lensBlur2.fs");
}