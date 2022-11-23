import Shader from "../core/Shader.js";
import Stage from "../core/Stage.js";
import Texture from "../core/Texture.js";
import { renderDefault } from "../image/image.js";
import { renderCfgMap } from "./Config.js";

export default class App {
    private _texture: Texture;
    private _stage: Stage;
    public get stage(): Stage {
        return this._stage;
    }
    private _texturePath: string;
    private _name: string;
    private _uniformsData: TUniformsData;
    public setData(name: string, uniformsData: TUniformsData) {
        this._name = name;
        this._uniformsData = uniformsData;

        const container = document.getElementById('input-uniforms');
        container?.childNodes?.forEach((node) => {
            container.removeChild(node);
        });

        uniformsData && Object.keys(uniformsData).forEach(key => {
            const uniformsValue = uniformsData[key];
            const [value, min, max, step] = Array.isArray(uniformsValue) ? uniformsValue : [uniformsValue, undefined, undefined, undefined];
            const numberInput = this.createNumberInput(key, uniformsData, value, min, max, step);
            container.appendChild(numberInput);
        });
    }

    private _shaderMap: Map<string, Shader>;
    public getShader(name: string) {
        return this._shaderMap.get(name);
    }
    public async getAddShader(name: string, vertexPath?: string, fragmentPath?: string) {
        let shader = this.getShader(name);
        if (!shader) {
            vertexPath = vertexPath || `${name}.vs`;
            fragmentPath = fragmentPath || `${name}.fs`;
            shader = await Shader.from(vertexPath, fragmentPath);
            this.setShader(name, shader);
        }

        return shader;
    }
    public setShader(name: string, shader: Shader) {
        this._shaderMap.set(name, shader);
    }
    public constructor(texturePath: string, name: string, uniformsData?: TUniformsData) {
        this._texturePath = texturePath;
        this._stage = new Stage();
        this._shaderMap = new Map();
        this.setData(name, uniformsData);
    }

    private createNumberInput(name: string, uniformsData: TUniformsData, value: unknown, min?: number, max?: number, step?: number) {
        const container = document.createElement('div');
        container.className = 'row-content';

        const title = document.createElement('label');
        title.className = 'label-uniforms';
        title.innerText = `${name}:`;
        container.appendChild(title);

        const input = document.createElement('input') as HTMLInputElement;
        input.className = "input-number";
        container.appendChild(input);
        input.type = 'text';
        if (min !== undefined) {
            input.min = String(min);
        }

        if (max !== undefined) {
            input.max = String(max);
        }

        input.value = String(value);

        let range: HTMLInputElement;
        if (min !== undefined && max !== undefined) {
            range = document.createElement('input');
            range.className = "input-range";
            container.appendChild(range);
            range.type = 'range';
            range.min = String(min);
            range.max = String(max);
            if (step !== undefined) {
                range.step = String(step);
            }
            range.value = String(value);

            range.addEventListener('input', (e) => {
                const value = +range.value;
                if (uniformsData[name][0] === value) return;

                uniformsData[name][0] = value;
                input.value = String(value);
                this.render();
            });
        }

        input.addEventListener('input', (e: InputEvent) => {
            input.value = input.value === '' ? '0' : input.value;
            let value = +input.value;
            if (Number.isNaN(value)) return;

            value = min !== undefined && value < min ? min : value;
            value = max !== undefined && value > max ? max : value;
            if (uniformsData[name][0] === value) return;

            uniformsData[name][0] = value;
            input.value = String(value);
            if (range) {
                range.value = String(value);
            }
            this.render();
        });

        return container;
    }

    public async render(name: string = this._name, uniformsData: TUniformsData = this._uniformsData, texturePath: string = this._texturePath) {
        if (!this._texture || this._texturePath !== texturePath) {
            this._texturePath = texturePath;
            this._texture = await Texture.from(texturePath);
        }

        this._stage.draw(this._texture);

        const renderFn = renderCfgMap.get(name) || renderDefault;
        await renderFn(this, name, uniformsData);

        this._stage.update();
    }
}