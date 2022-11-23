import Shader from "../core/Shader.js";
import Stage from "../core/Stage.js";
import Texture from "../core/Texture.js";
import { renderLensblur } from "../image/blur/lensblur/lensblur.js";
import { renderTiltshift } from "../image/blur/tiltshift/tiltshift.js";
import { renderDefault } from "../image/image.js";

export default class App {
    private _texture: Texture;
    public get texture() {
        return this._texture;
    }
    private _stage: Stage;
    public get stage(): Stage {
        return this._stage;
    }
    private _texturePath: string;
    private _data: [string, TUniformsData][];
    private _shaderMap: Map<string, Shader>;
    public getShader(name: string) {
        return this._shaderMap.get(name);
    }
    public setShader(name: string, shader: Shader) {
        this._shaderMap.set(name, shader);
    }
    private _renderMap: Map<string, (app: App, name: string, uniformsData?: TUniformsData) => void>;
    public constructor(texturePath: string, data: [string, TUniformsData][]) {
        this._texturePath = texturePath;
        this._data = data;
        this._stage = new Stage();
        this._shaderMap = new Map();
        this._renderMap = new Map([
            ["lensblur", renderLensblur],
            ["tiltshift", renderTiltshift],
        ]);

        const container = document.getElementById('input-uniforms');
        data.map(value => value[1])
            .filter(uniforms => !!uniforms)
            .forEach(uniforms => {
                Object.keys(uniforms).forEach(key => {
                    const uniformsValue = uniforms[key];
                    const [value, min, max, step] = Array.isArray(uniformsValue) ? uniformsValue : [uniformsValue, undefined, undefined, undefined];
                    const numberInput = this.createNumberInput(key, uniforms, value, min, max, step);
                    container.appendChild(numberInput);
                });
            });
    }

    private createNumberInput(name: string, uniforms: TUniformsData, value: unknown, min?: number, max?: number, step?: number) {
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

        let range: HTMLInputElement
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
                if (uniforms[name][0] === value) return;

                uniforms[name][0] = value;
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
            if (uniforms[name][0] === value) return;

            uniforms[name][0] = value;
            input.value = String(value);
            if (range) {
                range.value = String(value);
            }
            this.render();
        });

        return container;
    }

    public async render(texturePath: string = this._texturePath, data: [string, TUniformsData][] = this._data) {
        if (!this._texture || this._texturePath !== texturePath) {
            this._texturePath = texturePath;
            this._texture = await Texture.from(texturePath);
        }

        this._stage.draw(this._texture);

        await Promise.all(data.map(([name, uniformsData]) => {
            const renderFn = this._renderMap.get(name) || renderDefault;
            return renderFn(this, name, uniformsData);
        }));

        this._stage.update();
    }
}