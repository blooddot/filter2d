precision mediump float;

uniform sampler2D u_Sampler;
uniform float u_Power;
varying vec2 v_TexCoord;

void main () {
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    color = pow(color, vec4(u_Power));
    gl_FragColor = vec4(color);
}