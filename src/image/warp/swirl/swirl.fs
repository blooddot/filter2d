precision mediump float;

uniform sampler2D u_Sampler;
uniform float u_CenterX;
uniform float u_CenterY;
uniform float u_Width;
uniform float u_Height;
varying vec2 v_TexCoord;

uniform float u_Radius;
uniform float u_Angle;

void main() {
    vec2 texSize = vec2(u_Width, u_Height);
    vec2 coord = v_TexCoord * texSize;
    
    vec2 center = vec2(u_CenterX, u_CenterY);
    coord -= center;
    float distance = length(coord);
    if (distance < u_Radius) {
        float percent = (u_Radius - distance) / u_Radius;
        float theta = percent * percent * u_Angle;
        float s = sin(theta);
        float c = cos(theta);
        coord = vec2(
            coord.x * c - coord.y * s,
            coord.x * s + coord.y * c
        );
    }
    coord += center;
    
    gl_FragColor = texture2D(u_Sampler, coord / texSize);
    vec2 clampedCoord = clamp(coord, vec2(0.0), texSize);
    if( coord != clampedCoord ) {
        /* fade to transparent if we are outside the image */
        gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));
    }

}