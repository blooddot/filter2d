var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Shader from "../../../core/Shader.js";
import { renderTriangleblur } from "../../blur/triangleBlur/triangleBlur.js";
import { renderDefault } from "../../image.js";
const defaultVertexPath = "../../default/default.vs";
export function renderUnsharpmask(app, name, uniformsData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Store a copy of the current texture in the second texture unit
        app.stage.extraTexture.ensureFormat(app.stage.texture);
        app.stage.texture.use();
        app.stage.extraTexture.draw(Shader.defaultShader);
        // Blur the current texture, then use the stored texture to detect edges
        app.stage.extraTexture.use(1);
        yield renderTriangleblur(app, '../../blur/triangleblur/triangleblur', { radius: uniformsData["radius"] });
        const shader = yield app.getAddShader(name, defaultVertexPath);
        shader.textures({
            u_OriginalTexture: 1
        });
        renderDefault(app, name, uniformsData, defaultVertexPath);
    });
}
