precision mediump float;

uniform sampler2D u_BlurredTexture;
uniform sampler2D u_OriginalTexture;
uniform float u_Strength;
varying vec2 v_TexCoord;
void main() {
    vec4 blurred = texture2D(u_BlurredTexture, v_TexCoord);
    vec4 original = texture2D(u_OriginalTexture, v_TexCoord);
    gl_FragColor = mix(blurred, original, 1.0 + u_Strength);
}