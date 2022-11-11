precision mediump float;

uniform float u_Brightness;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main(){
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    color.rgb += u_Brightness;
    gl_FragColor = color;
}