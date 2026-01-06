// simple fragment shader that uses the UV value to make the color

// declare the varying variable that gets passed to the fragment shader
 varying vec2 v_uv;

void main()
{
    //create stripes
    float tilePos = floor(v_uv.y * 10.0);

    float stripe = mod(tilePos, 2.0);

    vec3 color = mix(vec3(1,0,0), vec3(1.,1.,1.), stripe);

    gl_FragColor = vec4(color,1);
}