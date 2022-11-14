precision mediump float;

uniform float u_Amount;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    float average = (color.r + color.g + color.b) / 3.0;
    float mx = max(color.r, max(color.g, color.b));
    float amt = (mx - average) * (-u_Amount * 3.0);
    color.rgb = mix(color.rgb, vec3(mx), amt);
    gl_FragColor = color;
}