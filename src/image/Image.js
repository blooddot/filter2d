var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Shader from "../core/Shader.js";
import Stage from "../core/Stage.js";
import Texture from "../core/Texture.js";
const texturePath = '../../../../resources/hello-world.png';
//@ts-ignore
window.renderImage = function (data) {
    const app = new App(data);
    app.render();
};
class App {
    constructor(data) {
        this._data = data;
        this._stage = new Stage();
        this._shaderMap = new Map();
        const container = document.getElementById('input-uniforms');
        data.map(value => value[1])
            .filter(uniforms => !!uniforms)
            .forEach(uniforms => {
            Object.keys(uniforms).forEach(key => {
                const uniformsValue = uniforms[key];
                const [value, min, max] = Array.isArray(uniformsValue) ? uniformsValue : [uniformsValue, undefined, undefined];
                const numberInput = this.createNumberInput(key, uniforms, value, min, max);
                container.appendChild(numberInput);
            });
        });
    }
    inputToRange(input, min, max) {
        return ((input - min) / (max - min) * 100).toFixed(2);
    }
    rangeToInput(range, min, max) {
        return (+range / 100 * (max - min) + min).toFixed(2);
    }
    createNumberInput(name, uniforms, value, min, max) {
        const container = document.createElement('div');
        container.className = 'row-content';
        const title = document.createElement('label');
        title.className = 'label-uniforms';
        title.innerText = `${name}:`;
        container.appendChild(title);
        const input = document.createElement('input');
        input.className = "input-number";
        container.appendChild(input);
        input.type = 'text';
        if (min !== undefined) {
            input.min = String(min);
        }
        if (max !== undefined) {
            input.max = String(max);
        }
        input.value = value;
        let range;
        if (min !== undefined && max !== undefined) {
            range = document.createElement('input');
            range.className = "input-range";
            container.appendChild(range);
            range.type = 'range';
            range.value = this.inputToRange(value, min, max);
            range.addEventListener('input', (e) => {
                const value = +this.rangeToInput(range.value, min, max);
                const uniformsValue = uniforms[name];
                if (typeof uniformsValue === "number") {
                    if (uniformsValue === +value)
                        return;
                    uniforms[name] = +value;
                }
                else {
                    if (uniformsValue[0] === +value)
                        return;
                    uniforms[name][0] = +value;
                }
                input.value = String(value);
                this.render();
            });
        }
        input.addEventListener('input', (e) => {
            input.value = input.value === '' ? '0' : input.value;
            let value = +input.value;
            if (Number.isNaN(value))
                return;
            value = min !== undefined && value < min ? min : value;
            value = max !== undefined && value > max ? max : value;
            const uniformsValue = uniforms[name];
            if (typeof uniformsValue === "number") {
                if (uniformsValue === value)
                    return;
                uniforms[name] = value;
            }
            else {
                if (uniformsValue[0] === value)
                    return;
                uniforms[name][0] = value;
            }
            input.value = String(value);
            if (range) {
                range.value = this.inputToRange(value, min, max);
            }
            this.render();
        });
        return container;
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._texture) {
                this._texture = yield Texture.from(texturePath);
            }
            this._stage.draw(this._texture);
            yield Promise.all(this._data.map(([name, uniformsData]) => __awaiter(this, void 0, void 0, function* () {
                let shader = this._shaderMap.get(name);
                if (!shader) {
                    shader = yield Shader.from(name);
                    this._shaderMap.set(name, shader);
                }
                const uniforms = uniformsData && Object.keys(uniformsData).reduce((data, key) => {
                    const value = uniformsData[key];
                    data[key] = Array.isArray(value) ? value[0] : value;
                    return data;
                }, {});
                this._stage.shading(shader, uniforms);
            })));
            this._stage.update();
        });
    }
}
