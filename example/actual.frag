precision mediump float;

varying vec3 vnormal;

#pragma glslify: dither = require(glsl-dither)

void main() {
  gl_FragColor = vec4(abs(vnormal), 1.0);
}
