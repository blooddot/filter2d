import { gl } from "./constant.js";
const defaultVertexSource = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`;
const defaultFragmentSource = `
    precision mediump float;
    uniform sampler2D u_Texture;
    varying vec2 v_TexCoord;
    void main() {
        gl_FragColor = texture2D(u_Texture, v_TexCoord);
    }
`;
export default class Shader {
    constructor(vertexSource, fragmentSource) {
        this._program = gl.createProgram();
        vertexSource = vertexSource || defaultVertexSource;
        fragmentSource = fragmentSource || defaultFragmentSource;
        gl.attachShader(this._program, this.compile(gl.VERTEX_SHADER, vertexSource));
        gl.attachShader(this._program, this.compile(gl.FRAGMENT_SHADER, fragmentSource));
        gl.linkProgram(this._program);
        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            throw new Error(`Could not link shader program ${gl.getProgramInfoLog(this._program)}`);
        }
    }
    static get defaultShader() {
        Shader._defaultShader = Shader._defaultShader || new Shader();
        return Shader._defaultShader;
    }
    compile(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw 'compile error: ' + gl.getShaderInfoLog(shader);
        }
        return shader;
    }
    uniforms(uniforms) {
        if (!uniforms)
            return this;
        gl.useProgram(this._program);
        Object.keys(uniforms).forEach((key) => {
            const value = uniforms[key];
            const location = gl.getUniformLocation(this._program, key);
            if (!location)
                return;
            if (Array.isArray(value)) {
                switch (value.length) {
                    case 1:
                        gl.uniform1f(location, value[0]);
                        break;
                    case 2:
                        gl.uniform2f(location, value[0], value[1]);
                        break;
                    case 3:
                        gl.uniform3f(location, value[0], value[1], value[2]);
                        break;
                    case 4:
                        gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                        break;
                    case 9:
                        gl.uniformMatrix3fv(location, false, new Float32Array(value));
                        break;
                    case 16:
                        gl.uniformMatrix4fv(location, false, new Float32Array(value));
                        break;
                    default:
                        throw `dont\'t know how to load uniform ${key} of length ${value.length}`;
                }
                return;
            }
            if (typeof value === 'number') {
                gl.uniform1f(location, value);
                return;
            }
            if (typeof value === 'boolean') {
                gl.uniform1i(location, value ? 1 : 0);
                return;
            }
            throw `attempted to set uniform ${key} to invalid value ${value || undefined}`;
        });
        return this;
    }
    textures(textures) {
        gl.useProgram(this._program);
        Object.keys(textures).forEach(key => {
            gl.uniform1i(gl.getUniformLocation(this._program, key), textures[key]);
        });
        return this;
    }
    draw() {
        // const viewport = gl.getParameter(gl.VIEWPORT);
        const top = 0.8;
        const left = -0.8;
        const right = 0.8;
        const bottom = -0.8;
        const vertexBuffer = Shader.vertexBuffer = Shader.vertexBuffer || gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([left, top, left, bottom, right, top, right, bottom]), gl.STATIC_DRAW);
        if (!Shader.texCoordBuffer) {
            const texCoordBuffer = Shader.texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1.0, 0, 0.0, 1.0, 1.0, 1.0, 0.0]), gl.STATIC_DRAW);
        }
        if (!this._positionAttribute) {
            this._positionAttribute = gl.getAttribLocation(this._program, 'a_Position');
            gl.enableVertexAttribArray(this._positionAttribute);
        }
        if (!this._texCoordAttribute) {
            this._texCoordAttribute = gl.getAttribLocation(this._program, 'a_TexCoord');
            gl.enableVertexAttribArray(this._texCoordAttribute);
        }
        gl.useProgram(this._program);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(this._positionAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, Shader.texCoordBuffer);
        gl.vertexAttribPointer(this._texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    destroy() {
        gl.deleteProgram(this._program);
        this._program = null;
    }
}