import { gl } from "./constant.js";
import Shader from "./Shader.js";
import Texture from "./Texture.js";
export default class Stage {
    get texture() {
        return this._texture;
    }
    get extraTexture() {
        return this._extraTexture;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
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
        if (!this._isInitialized || texture.width !== this._width || texture.height !== this._height) {
            this.initialize(width !== null && width !== void 0 ? width : texture.width, height !== null && height !== void 0 ? height : texture.height);
        }
        texture.use();
        this._texture.draw(Shader.defaultShader);
        return this;
    }
    update() {
        this._texture.use();
        this._flippedShader.draw();
        return this;
    }
    shading(shader, uniforms, textureIn = this._texture, textureOut = this._texture) {
        textureIn.use();
        this._spareTexture.draw(shader, uniforms);
        this._spareTexture.swap(textureOut);
        return this;
    }
    contents() {
        this._texture.use();
        const texture = new Texture(this._texture.width, this._texture.height, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.draw(Shader.defaultShader);
        return texture;
    }
}
