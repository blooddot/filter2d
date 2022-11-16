var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { gl } from "./constant.js";
import Shader from "./Shader.js";
import Texture from "./Texture.js";
export default class Stage {
    initialize(width, height) {
        var _a, _b;
        const type = gl.UNSIGNED_BYTE;
        (_a = this._texture) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this._spareTexture) === null || _b === void 0 ? void 0 : _b.destroy();
        this._width = width;
        this._height = height;
        this._texture = new Texture(width, height, gl.RGBA, type);
        this._spareTexture = new Texture(width, height, gl.RGBA, type);
        this._extraTexture = new Texture(width, height, gl.RGBA, type);
        this._flippedShader = this._flippedShader || new Shader();
        this._isInitialized = true;
    }
    draw(texture, width, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isInitialized || texture.width !== this._width || texture.height !== this._height) {
                this.initialize(width !== null && width !== void 0 ? width : texture.width, height !== null && height !== void 0 ? height : texture.height);
            }
            texture.bind();
            yield this._texture.draw();
            Shader.defaultShader.draw();
        });
    }
    update() {
        this._texture.bind();
        this._flippedShader.draw();
        return this;
    }
    simpleShader(shader, uniforms, textureIn, textureOut) {
        const texture = textureIn || this._texture;
        // if (!this._isInitialized || texture.width !== this._width || texture.height !== this._height) {
        //     this.initialize(texture.width, texture.height);
        // }
        texture.bind();
        texture.draw(() => {
            shader.uniforms(uniforms).draw();
        });
        // this._spareTexture.draw(() => {
        //     shader.uniforms(uniforms).draw();
        // });
        // this._spareTexture.swap(textureOut || this._texture);
    }
    contents() {
        this._texture.bind();
        const texture = new Texture(this._texture.width, this._texture.height, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.draw(() => {
            Shader.defaultShader.draw();
        });
        return texture;
    }
}
