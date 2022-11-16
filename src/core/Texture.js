import { gl } from "./constant.js";
export default class Texture {
    constructor(width, height, format, type) {
        this.id = gl.createTexture();
        this.width = width;
        this.height = height;
        this.format = format;
        this.type = type;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //对纹理图像进行y轴反转
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
        const texture = new Texture(0, 0, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.loadSource(source);
        return texture;
    }
    static getOfflineCanvas(texture) {
        const canvas = Texture._offlineCanvas = Texture._offlineCanvas || document.createElement("canvas");
        canvas.width = texture.width;
        canvas.height = texture.height;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        return canvas;
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
    draw(callback) {
        return new Promise(resolve => {
            const frameBuffer = Texture.frameBuffer = Texture.frameBuffer || gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
            gl.viewport(0, 0, this.width, this.height);
            resolve();
            callback === null || callback === void 0 ? void 0 : callback();
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        });
    }
    swap(texture) {
        [this.id, texture.id] = [texture.id, this.id];
        [this.width, texture.width] = [texture.width, this.width];
        [this.height, texture.height] = [texture.height, this.height];
        [this.format, texture.format] = [texture.format, this.format];
    }
    bind(unit = 0) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }
    unbind(unit = 0) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    destroy() {
        gl.deleteTexture(this.id);
        this.id = null;
    }
}
