import App from "../core/App.js";
import Shader from "../core/Shader.js";
import Texture from "../core/Texture.js";

const texturePath = '../../../../resources/hello-world.png';

//@ts-ignore
window.renderImage = function (data: [string, TUniformsData][]) {
    const app = new App(texturePath, data);
    app.render();
}

export async function renderDefault(app: App, name: string, uniformsData?: TUniformsData, vertexPath?: string, fragmentPath?: string, textureIn?: Texture, textureOut?: Texture) {
    vertexPath = vertexPath || `${name}.vs`;
    fragmentPath = fragmentPath || `${name}.fs`;
    let shader = app.getShader(name);
    if (!shader) {
        shader = await Shader.from(vertexPath, fragmentPath);
        app.setShader(name, shader);
    }

    const uniforms = uniformsData && Object.keys(uniformsData).reduce((data, key) => {
        data[key] = uniformsData[key][0];
        return data;
    }, {});
    app.stage.shading(shader, uniforms, textureIn, textureOut);
}