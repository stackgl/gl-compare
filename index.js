var triangle  = require('a-big-triangle')
var pixels    = require('canvas-pixels')
var glslify   = require('glslify')
var createFBO = require('gl-fbo')

module.exports = Compare

function Compare(gl, actual, expected) {
  if (!(this instanceof Compare)) return new Compare(gl, actual, expected)

  this.gl = gl
  this.actual = actual
  this.expected = expected
  this._mode = modes[0]
  this.shaders = {
    diff: glslify({
        vert: './shaders/full.vert'
      , frag: './shaders/diff.frag'
    })(gl),
    onion: glslify({
        vert: './shaders/full.vert'
      , frag: './shaders/onion.frag'
    })(gl),
    slide: glslify({
        vert: './shaders/full.vert'
      , frag: './shaders/slide.frag'
    })(gl)
  }

  this.actual.fbo = createFBO(gl, 512, 512)
  this.expected.fbo = createFBO(gl, 512, 512)

  this.diff = { amount: 0.1 }
  this.slide = { amount: 0.5 }
  this.onion = { amount: 0.5 }
}

Compare.prototype.run = function() {
  _run(this, this.actual)
  _run(this, this.expected)
}

function _run(ctx, fn) {
  var gl = ctx.gl

  fn.fbo.bind()
  fn.call(ctx, fn.fbo)

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
}

var modes = [ 'diff', 'onion', 'slide' ]
Object.defineProperty(Compare.prototype, 'mode', {
  get: function() { return this._mode },
  set: function(value) {
    value = String(value)

    if (modes.indexOf(value) === -1) throw new Error(
      'Invalid value for compare.mode, should be one of: ' +
      modes.join(', ')
    )

    return this._mode = value
  }
})

Compare.prototype.render = function() {
  var shader = this.shaders[this.mode]
  var gl = this.gl

  shader.bind()
  shader.uniforms.tActual = this.actual.fbo.color[0].bind(0)
  shader.uniforms.tExpected = this.expected.fbo.color[0].bind(1)
  shader.uniforms.uAmount = +this.amount

  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  triangle(gl)
}
