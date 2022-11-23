import App from "../core/App.js";
import Texture from "../core/Texture.js";

const texturePath = '../../../../resources/hello-world.png';

//@ts-ignore
window.renderImage = function (name: string, data: TUniformsData) {
    const app = new App(texturePath, data);
    app.render();
};

export async function renderDefault(app: App, name: string, uniformsData?: TUniformsData, vertexPath?: string, fragmentPath?: string, textureIn?: Texture, textureOut?: Texture) {
    const shader = await app.getAddShader(name, vertexPath, fragmentPath);

    const uniforms = uniformsData && Object.keys(uniformsData).reduce((data, key) => {
        data[key] = uniformsData[key][0];
        return data;
    }, {});
    app.stage.shading(shader, uniforms, textureIn, textureOut);
}