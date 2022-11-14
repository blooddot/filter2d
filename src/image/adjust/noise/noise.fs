precision mediump float;

uniform float u_Amount;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    
    float diff = (rand(v_TexCoord) - 0.5) * u_Amount;
    color.r += diff;
    color.g += diff;
    color.b += diff;
    
    gl_FragColor = color;
        
}