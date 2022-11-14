precision mediump float;

uniform float u_Amount;
uniform float u_Size;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    float dis = distance(v_TexCoord, vec2(0.5, 0.5));
    color.rgb *= smoothstep(0.8, u_Size * 0.799, dis * (u_Amount + u_Size));
    gl_FragColor = color;
}