precision mediump float;

uniform sampler2D tExpected;
uniform sampler2D tActual;
uniform float uAmount;
varying vec2 vUv;

void main() {
  vec3 ca = texture2D(tActual, vUv).rgb;
  vec3 ce = texture2D(tExpected, vUv).rgb;
  vec3 cs = abs(ca - ce);
  float scale = max(uAmount * 10.0, 0.0001);

  gl_FragColor = vec4(
      pow(cs.x, scale)
    , pow(cs.y, scale)
    , pow(cs.z, scale)
    , 1.0
  );
}
