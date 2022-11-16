import { gl } from "./constant.js";
import Shader from "./Shader.js";
import Texture from "./Texture.js";

export default class Stage {
    private _texture: Texture;
    private _spareTexture: Texture;
    private _extraTexture: Texture;
    private _width: number;
    private _height: number;
    private _flippedShader: Shader;
    private _isInitialized: boolean;

    public initialize(width: number, height: number) {
        const type = gl.UNSIGNED_BYTE;

        this._texture?.destroy();
        this._spareTexture?.destroy();
        this._width = width;
        this._height = height;
        this._texture = new Texture(width, height, gl.RGBA, type);
        this._spareTexture = new Texture(width, height, gl.RGBA, type);
        this._extraTexture = new Texture(width, height, gl.RGBA, type);
        this._flippedShader = this._flippedShader || new Shader();

        this._isInitialized = true;
    }

    public async draw(texture: Texture, width?: number, height?: number) {
        if (!this._isInitialized || texture.width !== this._width || texture.height !== this._height) {
            this.initialize(width ?? texture.width, height ?? texture.height);
        }

        texture.bind();
        await this._texture.draw();
        Shader.defaultShader.draw();
    }

    public update() {
        this._texture.bind();
        this._flippedShader.draw();
        return this;
    }

    public simpleShader(shader: Shader, uniforms: Record<string, unknown>, textureIn?: Texture, textureOut?: Texture) {
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

    public contents() {
        this._texture.bind();
        const texture = new Texture(this._texture.width, this._texture.height, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.draw(() => {
            Shader.defaultShader.draw();
        });
        return texture;
    }
}