precision mediump float;

uniform sampler2D u_Sampler;
uniform float u_BlurRadius;
uniform float u_GradientRadius;
uniform vec2 u_Start;
uniform vec2 u_End;
uniform vec2 u_Delta;
uniform vec2 u_TexSize;
varying vec2 v_TexCoord;

float random(vec3 scale, float seed) {
    /* use the fragment position for a different seed per-pixel */
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

void main() {
    vec4 color = vec4(0.0);
    float total = 0.0;

    /* randomize the lookup values to hide the fixed number of samples */
    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);

    vec2 normal = normalize(vec2(u_Start.y - u_End.y, u_End.x - u_Start.x));
    float radius = smoothstep(0.0, 1.0, abs(dot(v_TexCoord * u_TexSize - u_Start, normal)) / u_GradientRadius) * u_BlurRadius;
    for (float t = -30.0; t <= 30.0; t++) {
        float percent = (t + offset - 0.5) / 30.0;
        float weight = 1.0 - abs(percent);
        vec4 sample = texture2D(u_Sampler, v_TexCoord + u_Delta / u_TexSize * percent * radius);
        
        /* switch to pre-multiplied alpha to correctly blur transparent images */
        sample.rgb *= sample.a;
        
        color += sample * weight;
        total += weight;
    }

    gl_FragColor = color / total;

    /* switch back from pre-multiplied alpha */
    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
}