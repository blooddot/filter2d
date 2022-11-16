import { getWebGLContext } from "../../libs/cuon/cuon-utils.js";
const canvas = document.getElementById("webgl");
export const gl = getWebGLContext(canvas);
