import { gl } from "./constant.js";
import Shader from "./Shader.js";

function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject();
        image.src = src;
    });
}

export default class Texture {
    public static async from(source: string | TexImageSource): Promise<Texture> {
        const image = typeof source === "string" ? await loadImage(source) : source;
        const texture = new Texture(0, 0, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.loadSource(image);
        return texture;
    }

    // private static _offlineCanvas: HTMLCanvasElement;
    // public static getOfflineCanvas(texture: Texture) {
    //     const canvas = Texture._offlineCanvas = Texture._offlineCanvas || document.createElement("canvas");
    //     canvas.width = texture.width;
    //     canvas.height = texture.height;
    //     const context = canvas.getContext("2d");
    //     context.clearRect(0, 0, canvas.width, canvas.height);

    //     return canvas;
    // }

    public static frameBuffer: WebGLFramebuffer;

    public id: WebGLTexture;

    public width: number;

    public height: number;

    public format: number;

    public type: number;

    public constructor(width: number, height: number, format: number, type: number) {
        this.id = gl.createTexture();
        this.width = width;
        this.height = height;
        this.format = format;
        this.type = type;

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  //对纹理图像进行y轴反转
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

    public loadSource(source: TexImageSource) {
        this.width = source.width;
        this.height = source.height;

        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, source);
    }

    public loadBytes(width: number, height: number, data: IterableIterator<number>) {
        this.width = width;
        this.height = height;
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;

        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, new Uint8Array(data));
    }

    public ensureFormat(texture: Texture);
    public ensureFormat(width: number, height: number, format: number, type: number);
    public ensureFormat(...params: unknown[]) {
        let width: number;
        let height: number;
        let format: number;
        let type: number;
        if (params.length === 1) {
            const texture = params[0] as Texture;
            width = texture.width;
            height = texture.height;
            format = texture.format;
            type = texture.type;
        } else {
            [width, height, format, type] = params as [number, number, number, number];
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

    public draw(shader?: Shader, uniforms?: Record<string, unknown>) {
        const frameBuffer = Texture.frameBuffer = Texture.frameBuffer || gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
        gl.viewport(0, 0, this.width, this.height);

        shader?.uniforms(uniforms).draw();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    public swap(texture: Texture) {
        [this.id, texture.id] = [texture.id, this.id];
        [this.width, texture.width] = [texture.width, this.width];
        [this.height, texture.height] = [texture.height, this.height];
        [this.format, texture.format] = [texture.format, this.format];
    }

    public use(unit: number = 0) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }

    public unuse(unit: number = 0) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public destroy() {
        gl.deleteTexture(this.id);
        this.id = null;
    }
}