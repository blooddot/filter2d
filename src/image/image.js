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
const texturePath = '../../../../resources/hello-world.png';
//@ts-ignore
window.renderImage = function (name, uniformsData) {
    const app = new App(texturePath, name, uniformsData);
    app.render();
};
export function renderDefault(app, name, uniformsData, vertexPath, fragmentPath, textureIn, textureOut) {
    return __awaiter(this, void 0, void 0, function* () {
        const shader = yield app.getAddShader(name, vertexPath, fragmentPath);
        const uniforms = uniformsData && Object.keys(uniformsData).reduce((data, key) => {
            data[key] = uniformsData[key][0];
            return data;
        }, {});
        app.stage.shading(shader, uniforms, textureIn, textureOut);
    });
}
