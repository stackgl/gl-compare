precision mediump float;

attribute vec2 position;
varying   vec2 vUv;

void main() {
  vUv = (position + vec2(1.0)) / 2.0;
  gl_Position = vec4(position, 1.0, 1.0);
}
