precision mediump float;

uniform sampler2D u_Sampler0;
uniform vec2 u_Delta0;
varying vec2 v_TexCoord;

float random(vec3 scale, float seed) {
    /* use the fragment position for a different seed per-pixel */
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

vec4 sample(vec2 delta){
    /* randomize the lookup values to hide the fixed number of samples */
    float offset = random(vec3(delta, 151.7182), 0.0);
    vec4 color = vec4(0.0);
    float total = 0.0;
    for(float t = 0.0; t <= 30.0; t++){
        float percent = (t + offset) / 30.0;
        color += texture2D(u_Sampler0, v_TexCoord + delta * percent);
        total += 1.0;
    }

    return color / total;
}

void main (){
    gl_FragColor = sample(u_Delta0);
}