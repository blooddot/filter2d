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
import { renderDefault } from "../image/image.js";
import { renderCfgMap } from "./Config.js";
export default class App {
    constructor(texturePath, name, uniformsData) {
        this._texturePath = texturePath;
        this._stage = new Stage();
        this._shaderMap = new Map();
        this.setData(name, uniformsData);
    }
    get stage() {
        return this._stage;
    }
    setData(name, uniformsData) {
        var _a;
        this._name = name;
        this._uniformsData = uniformsData;
        const container = document.getElementById('input-uniforms');
        (_a = container === null || container === void 0 ? void 0 : container.childNodes) === null || _a === void 0 ? void 0 : _a.forEach((node) => {
            container.removeChild(node);
        });
        uniformsData && Object.keys(uniformsData).forEach(key => {
            const uniformsValue = uniformsData[key];
            const [value, min, max, step] = Array.isArray(uniformsValue) ? uniformsValue : [uniformsValue, undefined, undefined, undefined];
            const numberInput = this.createNumberInput(key, uniformsData, value, min, max, step);
            container.appendChild(numberInput);
        });
    }
    getShader(name) {
        return this._shaderMap.get(name);
    }
    getAddShader(name, vertexPath, fragmentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let shader = this.getShader(name);
            if (!shader) {
                vertexPath = vertexPath || `${name}.vs`;
                fragmentPath = fragmentPath || `${name}.fs`;
                shader = yield Shader.from(vertexPath, fragmentPath);
                this.setShader(name, shader);
            }
            return shader;
        });
    }
    setShader(name, shader) {
        this._shaderMap.set(name, shader);
    }
    createNumberInput(name, uniformsData, value, min, max, step) {
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
        input.value = String(value);
        let range;
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
                if (uniformsData[name][0] === value)
                    return;
                uniformsData[name][0] = value;
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
            if (uniformsData[name][0] === value)
                return;
            uniformsData[name][0] = value;
            input.value = String(value);
            if (range) {
                range.value = String(value);
            }
            this.render();
        });
        return container;
    }
    render(name = this._name, uniformsData = this._uniformsData, texturePath = this._texturePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._texture || this._texturePath !== texturePath) {
                this._texturePath = texturePath;
                this._texture = yield Texture.from(texturePath);
            }
            this._stage.draw(this._texture);
            const renderFn = renderCfgMap.get(name) || renderDefault;
            yield renderFn(this, name, uniformsData);
            this._stage.update();
        });
    }
}
