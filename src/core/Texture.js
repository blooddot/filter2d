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
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject();
        image.src = src;
    });
}
export default class Texture {
    constructor(width, height, format, type) {
        this.id = gl.createTexture();
        this.width = width;
        this.height = height;
        this.format = format;
        this.type = type;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //对纹理图像进行y轴反转
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        // 这告诉WebGL如果纹理需要被缩小时，采用线性插值的方式来进行采样
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // 这告诉WebGL如果纹理需要被方法时，采用线性插值的方式来进行采样
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // // 告诉WebGL如果纹理坐标超出了s坐标的最大/最小值，直接取边界值
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // // 告诉WebGL如果纹理坐标超出了t坐标的最大/最小值，直接取边界值
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (width && height) {
            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, null);
        }
    }
    static from(source) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = typeof source === "string" ? yield loadImage(source) : source;
            const texture = new Texture(0, 0, gl.RGBA, gl.UNSIGNED_BYTE);
            texture.loadSource(image);
            return texture;
        });
    }
    loadSource(source) {
        this.width = source.width;
        this.height = source.height;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, source);
    }
    loadBytes(width, height, data) {
        this.width = width;
        this.height = height;
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, new Uint8Array(data));
    }
    ensureFormat(...params) {
        let width;
        let height;
        let format;
        let type;
        if (params.length === 1) {
            const texture = params[0];
            width = texture.width;
            height = texture.height;
            format = texture.format;
            type = texture.type;
        }
        else {
            [width, height, format, type] = params;
        }
        if (this.width !== width || this.height !== height || this.format !== format || this.type !== type) {
            this.width = width;
            this.height = height;
            this.format = format;
            this.type = type;
            gl.bindTexture(gl.TEXTURE_2D, this.id);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, null);
        }
    }
    draw(shader, uniforms) {
        const frameBuffer = Texture.frameBuffer = Texture.frameBuffer || gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
        gl.viewport(0, 0, this.width, this.height);
        shader === null || shader === void 0 ? void 0 : shader.uniforms(uniforms).draw();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    swap(texture) {
        [this.id, texture.id] = [texture.id, this.id];
        [this.width, texture.width] = [texture.width, this.width];
        [this.height, texture.height] = [texture.height, this.height];
        [this.format, texture.format] = [texture.format, this.format];
    }
    use(unit = 0) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }
    unuse(unit = 0) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    destroy() {
        gl.deleteTexture(this.id);
        this.id = null;
    }
}
