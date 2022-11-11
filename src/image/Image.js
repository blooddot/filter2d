var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initWebGL } from "../utils/util.js";
//@ts-ignore
export function renderImage(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const { gl, program } = yield initWebGL(name);
        const vertexCount = initVertexBuffers(gl, program);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        initTexture(gl, program, vertexCount);
    });
}
const initVertexBuffers = (gl, program) => {
    //顶点坐标，纹理坐标
    const verticesTexCoords = new Float32Array([
        -0.8, 0.8, 0.0, 1.0,
        -0.8, -0.8, 0.0, 0.0,
        0.8, 0.8, 1.0, 1.0,
        0.8, -0.8, 1.0, 0.0
    ]);
    const vertexBuffer = gl.createBuffer(); //创建缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); //将缓冲区对象绑定到目标
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW); //向缓冲区对象写入顶点坐标和纹理坐标
    const F_SIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    const vertexPositionSize = 2; //单个顶点坐标的组成数量
    const vertexTexCoordSize = 2; //单个顶点纹理坐标的组成数量
    const vertexSize = vertexPositionSize + vertexTexCoordSize; //单个顶点的组成数量
    const a_Position = gl.getAttribLocation(program, 'a_Position'); //获取 a_Position 存储地址
    gl.vertexAttribPointer(a_Position, vertexPositionSize, gl.FLOAT, false, F_SIZE * vertexSize, 0); //将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position); //连接 a_Position 变量与分配给它的缓冲区对象
    const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord'); //获取 a_TexCoord 存储地址
    gl.vertexAttribPointer(a_TexCoord, vertexTexCoordSize, gl.FLOAT, false, F_SIZE * vertexSize, F_SIZE * vertexPositionSize); //将缓冲区对象分配给 a_TexCoord 变量
    gl.enableVertexAttribArray(a_TexCoord); //连接 a_TexCoord 变量与分配给它的缓冲区对象
    const vertexCount = verticesTexCoords.length / vertexSize; //顶点数量
    return vertexCount;
};
const initTexture = (gl, program, n) => {
    const texture = gl.createTexture(); //创建纹理对象
    const u_Sampler = gl.getUniformLocation(program, 'u_Sampler'); //获取u_Sampler的存储位置
    const image = new Image(); //创建image对象
    image.onload = () => loadTexture(gl, program, n, texture, u_Sampler, image);
    image.src = '../../../../resources/hello-world.png';
};
const loadTexture = (gl, program, n, texture, u_Sampler, image) => {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //对纹理图像进行y轴反转
    gl.activeTexture(gl.TEXTURE0); //开启0号纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture); //向target绑定纹理对象
    // 这告诉WebGL如果纹理需要被缩小时，采用线性插值的方式来进行采样
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 这告诉WebGL如果纹理需要被方法时，采用线性插值的方式来进行采样
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // // 告诉WebGL如果纹理坐标超出了s坐标的最大/最小值，直接取边界值
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // // 告诉WebGL如果纹理坐标超出了t坐标的最大/最小值，直接取边界值
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); //配置纹理图像
    gl.uniform1i(u_Sampler, 0); //将0号纹理传递给着色器
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); //绘制矩形
};
