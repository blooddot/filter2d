precision mediump float;

uniform float u_Contrast;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main(){
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    if (u_Contrast > 0.0) {
        color.rgb = (color.rgb - 0.5) / (1.0 - u_Contrast) + 0.5;
    } else {
        color.rgb = (color.rgb - 0.5) * (1.0 + u_Contrast) + 0.5;
    }
    gl_FragColor = color;
}