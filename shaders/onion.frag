precision mediump float;

uniform sampler2D tExpected;
uniform sampler2D tActual;
uniform float uAmount;
varying vec2 vUv;

void main() {
  vec3 ca = texture2D(tActual, vUv).rgb;
  vec3 ce = texture2D(tExpected, vUv).rgb;

  gl_FragColor = vec4(mix(ce, ca, uAmount), 1.0);
}
