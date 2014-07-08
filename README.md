# gl-compare [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Visually compare two WebGL render loops on the fly by drawing them to an FBO
and diffing them with shaders.

[![gl-compare](http://imgur.com/zVtYFax.jpg)](http://gl-modules.github.io/gl-compare)

## Usage

[![NPM](https://nodei.co/npm/gl-compare.png)](https://nodei.co/npm/gl-compare/)

### comparison = compare(gl, actual, expected)
Creates a comparison renderer.

* `gl` is the WebGL context.
* `actual(fbo)` is the first render loop to run.
* `expected(fbo)` is the second render loop to run.

Note that these are both running within the same context – generally, this won't
be a problem if you're cleaning up after yourself, but keep that in mind. Also
note that instead of using:

``` javascript
gl.bindFramebuffer(gl.FRAMEBUFFER, null)
```

You should use:

``` javascript
fbo.bind()
```

Where `fbo` is the first argument passed to the render loop. If you'd like to
resize your FBOs to match the size of the canvas:

``` javascript
function actual(fbo) {
  fbo.shape = [canvas.height, canvas.width]
}

function expected(fbo) {
  fbo.shape = [canvas.height, canvas.width]
}
```

### comparison.run()
Renders the `actual` and `expected` loops to their respective FBOs. Should be
called before you call `comparison.render`.

### comparison.render()
Renders the comparison to your screen.

### comparison.mode
The mode of comparison – may be set to one of the following:

* `diff`: RGB color difference.
* `onion`: blending between `actual` and `expected`.
* `slide`: a slider that divides `actual` and `expected`.

### comparison.amount
Used to vary the amount of diffing to do for each mode, and can be any value
between 0 and 1. Has the following effects:

* `diff`: 0 will amplify *any* difference considerably, whereas 1 will dull the
  difference to only show the most significant changes.
* `onion`: 0 will display `expected`, 1 will display `actual`, and any values
  in between will be a mixture of both.
* `slide`: 0 will display `expected`, 1 will display `actual`, and any values
  in between will move the slider from the left of the buffer to the right.

## License

MIT. See [LICENSE.md](http://github.com/gl-modules/gl-compare/blob/master/LICENSE.md) for details.
