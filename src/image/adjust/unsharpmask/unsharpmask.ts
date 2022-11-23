import App from "../../../core/App.js";
import Shader from "../../../core/Shader.js";
import { renderTriangleblur } from "../../blur/triangleblur/triangleblur.js";
import { renderDefault } from "../../image.js";

const defaultVertexPath = "../../default/default.vs";
export async function renderUnsharpmask(app: App, name: string, uniformsData: TUniformsData) {
    // Store a copy of the current texture in the second texture unit
    app.stage.extraTexture.ensureFormat(app.stage.texture);
    app.stage.texture.use();
    app.stage.extraTexture.draw(Shader.defaultShader);

    // Blur the current texture, then use the stored texture to detect edges
    app.stage.extraTexture.use(1);
    await renderTriangleblur(app, '../../blur/triangleblur/triangleblur', { radius: uniformsData["radius"] })

    const shader = await app.getAddShader(name, defaultVertexPath);
    shader.textures({
        u_OriginalTexture: 1
    });

    renderDefault(app, name, uniformsData, defaultVertexPath);
}