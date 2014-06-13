precision mediump float;

attribute vec3 position;
attribute vec3 normal;
uniform mat4 uproj;
uniform mat4 uview;
varying vec3 vnormal;

void main() {
  vnormal = normal;
  gl_Position = uproj * uview * vec4(position, 1.0);
}
