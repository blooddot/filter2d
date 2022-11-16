import { getWebGLContext } from "../../libs/cuon/cuon-utils.js";

const canvas = document.getElementById("webgl") as HTMLCanvasElement;

export const gl = getWebGLContext(canvas);