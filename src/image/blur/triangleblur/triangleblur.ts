import App from "../../../core/App.js";
import { renderDefault } from "../../image.js";
const defaultVertexPath = "../../default/default.vs";

export async function renderTriangleblur(app: App, name: string, uniformsData: TUniformsData) {
    const { radius: [radius] } = uniformsData as unknown as { radius: [number] };

    await renderDefault(app, name, {
        u_Delta: [[radius / app.stage.width, 0]]
    }, defaultVertexPath);

    await renderDefault(app, name, {
        u_Delta: [[0, radius / app.stage.height]]
    }, defaultVertexPath);
}