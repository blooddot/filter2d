precision mediump float;

uniform float u_Amount;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    float r = color.r;
    float g = color.g;
    float b = color.b;

    color.r = min(1.0, (r * (1.0 - (0.607 * u_Amount))) + (g * (0.769 * u_Amount)) + (b * (0.189 * u_Amount)));
    color.g = min(1.0, (r * 0.349 * u_Amount) + (g * (1.0 - (0.314 * u_Amount))) + (b * (0.168 * u_Amount)));
    color.b = min(1.0, (r * 0.272 * u_Amount) + (g * 0.534 * u_Amount) + (b * (1.0 - (0.869 * u_Amount))));

    gl_FragColor = color;
}