precision mediump float;

uniform float u_Strength;
uniform float u_Width;
uniform float u_Height;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main(){
    vec4 center = texture2D(u_Sampler, v_TexCoord);
    vec4 color = vec4(0.0);
    float total = 0.0;
    for (float x = -4.0; x <= 4.0; x += 1.0) {
        for (float y = -4.0; y <= 4.0; y += 1.0) {
            vec4 sample = texture2D(u_Sampler, v_TexCoord + vec2(x, y) / vec2(u_Width, u_Height));
            float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));
            float exponent = 3.0 + 200.0 * pow(1.0 - u_Strength, 4.0);

            weight = pow(weight, exponent);
            color += sample * weight;
            total += weight;
        }
    }
    gl_FragColor = color / total;
}