precision mediump float;

uniform float u_Saturation;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main(){
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    float average = (color.r + color.g + color.b) / 3.0;
    if (u_Saturation > 0.0) {
        color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - u_Saturation));
    } else {
        color.rgb += (average - color.rgb) * (-u_Saturation);
    }
    gl_FragColor = color;
}