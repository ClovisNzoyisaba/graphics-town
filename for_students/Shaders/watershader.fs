// simple fragment shader that uses the UV value to make the color

// declare the varying variable that gets passed to the fragment shader
 varying vec2 v_uv;
 uniform float uTime;

void main()
{
    float wave = sin((v_uv.y * 8.0 + uTime * 2.0)) * 0.5 + 
                 cos((v_uv.x * 8.0 + uTime * 0.8)) * 0.3; ;

    vec2 distortedUV = vec2(v_uv.x + wave, v_uv.y + wave);

    float tilePos = floor((distortedUV.y) * 10.0);
    float stripe = mod(tilePos, 2.0);

    vec3 baseColor = mix(vec3(0.2, 0.5, 0.7), vec3(0.0, 0.3, 0.6), distortedUV.y);

    vec3 finalColor = mix(baseColor, vec3(0.2,0.2,1), stripe);

    gl_FragColor = vec4(finalColor, 1.0);
}