precision mediump float;

uniform sampler2D u_Sampler;
uniform float u_CenterX;
uniform float u_CenterY;
uniform float u_Width;
uniform float u_Height;
varying vec2 v_TexCoord;
uniform float u_Radius;
uniform float u_Strength;

void main() {
    vec2 texSize = vec2(u_Width, u_Height);
    vec2 coord = v_TexCoord * texSize;
    
    vec2 center = vec2(u_CenterX, u_CenterY);
    coord -= center;
    float distance = length(coord);
    if(distance < u_Radius){
        float percent = distance / u_Radius;
        if( u_Strength > 0.0){
            coord *= mix(1.0, smoothstep(0.0, u_Radius / distance, percent), u_Strength * 0.75);
        } else {
            coord *= mix(1.0, pow(percent, 1.0 + u_Strength * 0.75) * u_Radius / distance, 1.0 - percent);
        }
    }
    coord += center;

    gl_FragColor = texture2D(u_Sampler, coord / texSize);
    vec2 clampedCoord = clamp(coord, vec2(0.0), texSize);
    if( coord != clampedCoord ) {
        /* fade to transparent if we are outside the image */
        gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));
    }

}