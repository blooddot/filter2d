var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import App from "../core/App.js";
import Shader from "../core/Shader.js";
const texturePath = '../../../../resources/hello-world.png';
//@ts-ignore
window.renderImage = function (data) {
    const app = new App(texturePath, data);
    app.render();
};
export function renderDefault(app, name, uniformsData, vertexPath, fragmentPath, textureIn, textureOut) {
    return __awaiter(this, void 0, void 0, function* () {
        vertexPath = vertexPath || `${name}.vs`;
        fragmentPath = fragmentPath || `${name}.fs`;
        let shader = app.getShader(name);
        if (!shader) {
            shader = yield Shader.from(vertexPath, fragmentPath);
            app.setShader(name, shader);
        }
        const uniforms = uniformsData && Object.keys(uniformsData).reduce((data, key) => {
            data[key] = uniformsData[key][0];
            return data;
        }, {});
        app.stage.shading(shader, uniforms, textureIn, textureOut);
    });
}
