precision mediump float;

uniform sampler2D u_Sampler;
uniform float u_CenterX;
uniform float u_CenterY;
uniform float u_Strength;
uniform float u_Width;
uniform float u_Height;
varying vec2 v_TexCoord;

float random(vec3 scale, float seed) {
    /* use the fragment position for a different seed per-pixel */
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

void main() {
    vec4 color = vec4(0.0);
    float total = 0.0;
    vec2 center = vec2(u_CenterX, u_CenterY);
    vec2 texSize = vec2(u_Width, u_Height);
    vec2 toCenter = center - v_TexCoord * texSize;
    /* randomize the lookup values to hide the fixed number of samples */
    float offset = random(vec3(12.9898, 78.233,151.7182), 0.0);

    for(float t = 0.0; t <= 40.0; t ++) {
        float percent = (t + offset) / 40.0;
        float weight = 4.0 * (percent - percent * percent);
        vec4 sample = texture2D(u_Sampler, v_TexCoord + toCenter * percent * u_Strength / texSize);

        /* switch to pre-multiplied alpha to correctly blur transparent images */
        sample.rgb *= sample.a;

        color += sample * weight;
        total += weight;
    }

    gl_FragColor = color / total;

    /* switch back from pre-multiplied alpha */
    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
}