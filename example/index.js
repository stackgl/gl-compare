var canvas         = document.body.appendChild(document.createElement('canvas'))
var clear          = require('gl-clear')({ color: [0, 0, 0, 1] })
var createCamera   = require('canvas-orbit-camera')
var mat4           = require('gl-matrix').mat4
var quat           = require('gl-matrix').quat
var createGeometry = require('gl-geometry')
var createContext  = require('gl-context')
var fitter         = require('canvas-fit')
var icosphere      = require('icosphere')
var normals        = require('normals')
var glslify        = require('glslify')
var domify         = require('domify')
var comparator     = require('../')

var proj    = mat4.create()
var gl      = createContext(canvas, render)
var camera  = createCamera(canvas)
var compare = comparator(gl, actual, expected)
var sphere  = icosphere(2)
var fit     = fitter(canvas)
var mesh    = createGeometry(gl)
  .attr('position', sphere)
  .attr('normal', normals.vertexNormals(sphere.cells, sphere.positions))

var input = document.body.appendChild(domify(
  '<select><option selected>diff</option><option>slide</option><option>onion</option></select>'
))

var slide = document.body.appendChild(domify(
  '<input type="range" min="0" max="1" value="0.01" step="0.001"/>'
))

input.style.position = 'absolute'
input.style.top = '64px'
input.style.right = '32px'

slide.style.position = 'absolute'
slide.style.top = '32px'
slide.style.right = '32px'

camera.distance = 3
compare.mode = 'diff'

var actualShader = glslify({
    vert: './reverse.vert'
  , frag: './actual.frag'
})(gl)

var expectedShader = glslify({
    vert: './basic.vert'
  , frag: './expected.frag'
})(gl)

window.addEventListener('resize', resize(), false)
function resize() {
  fit()

  compare.actual.fbo.shape =
  compare.expected.fbo.shape = [canvas.height, canvas.width]

  return resize
}

function actual(fbo) {
  gl.viewport(0, 0, fbo.shape[1], fbo.shape[0])
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  clear(gl)

  mesh.bind(actualShader)
  actualShader.uniforms.uproj = proj
  actualShader.uniforms.uview = camera.view()
  mesh.draw()
  mesh.unbind()
}

function expected(fbo) {
  gl.viewport(0, 0, fbo.shape[1], fbo.shape[0])
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  clear(gl)

  mesh.bind(expectedShader)
  expectedShader.uniforms.uproj = proj
  expectedShader.uniforms.uview = camera.view()
  mesh.draw()
  mesh.unbind()
}

function render() {
  clear(gl)

  quat.rotateX(camera.rotation, camera.rotation, 0.0015)
  quat.rotateY(camera.rotation, camera.rotation, 0.0015)
  quat.rotateZ(camera.rotation, camera.rotation, 0.0015)
  mat4.perspective(proj
    , Math.PI / 4
    , canvas.width / canvas.height
    , 0.001
    , 10000
  )

  compare.mode = input.value
  compare.amount = slide.value
  compare.run()
  compare.render()
  camera.tick()
}
