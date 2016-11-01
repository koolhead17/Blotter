(function(Blotter, _, THREE, Detector, requestAnimationFrame, EventEmitter, GrowingPacker, setImmediate) {

  Blotter.RollDistortMaterial = function() {
    Blotter.Material.apply(this, arguments);
  };

  Blotter.RollDistortMaterial.prototype = Object.create(Blotter.Material.prototype);

  _.extend(Blotter.RollDistortMaterial.prototype, (function () {

    function _mainImageSrc () {
      var mainImageSrc = [

        "vec3 mod289(vec3 x) {",
        "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",

        "vec2 mod289(vec2 x) {",
        "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",

        "vec3 permute(vec3 x) {",
        "  return mod289(((x * 34.0) + 1.0) * x);",
        "}",

        "float snoise(vec2 v) {",
        "  const vec4 C = vec4(0.211324865405187,",
        "                      0.366025403784439,",
        "                     -0.577350269189626,",
        "                      0.024390243902439);",
        "  vec2 i  = floor(v + dot(v, C.yy) );",
        "  vec2 x0 = v -   i + dot(i, C.xx);",

        "  vec2 i1;",
        "  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);",
        "  vec4 x12 = x0.xyxy + C.xxzz;",
        "  x12.xy -= i1;",

        "  i = mod289(i); // Avoid truncation effects in permutation",
        "  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));",

        "  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);",
        "  m = m*m ;",
        "  m = m*m ;",

        "  vec3 x = 2.0 * fract(p * C.www) - 1.0;",
        "  vec3 h = abs(x) - 0.5;",
        "  vec3 ox = floor(x + 0.5);",
        "  vec3 a0 = x - ox;",

        "  m *= 1.79284291400159 - 0.85373472095314 * ( a0 * a0 + h * h );",

        "  vec3 g;",
        "  g.x  = a0.x  * x0.x  + h.x  * x0.y;",
        "  g.yz = a0.yz * x12.xz + h.yz * x12.yw;",
        "  return 130.0 * dot(m, g);",
        "}",

        // End Ashima 2D Simplex Noise

        "void mainImage( out vec4 mainImage, in vec2 fragCoord ) {",

        "  vec2 p = fragCoord / uResolution;",
        "  float ty = uTime * uSpeed;",
        "  float yt = p.y - ty;",

           //smooth distortion
        "  float offset = snoise(vec2(yt * 3.0, 0.0)) * 0.2;",
           // boost distortion
        "  offset = offset * uDistortion * offset * uDistortion * offset;",
           //add fine grain distortion
        "  offset += snoise(vec2(yt * 50.0, 0.0)) * uDistortion2 * 0.001;",
           //combine distortion on X with roll on Y
        "  mainImage = textTexture(vec2(fract(p.x + offset), fract(p.y)));",

        "}"
      ].join("\n");

      return mainImageSrc;
    }

    return {

      constructor : Blotter.RollDistortMaterial,

      init : function () {
        this.mainImage = _mainImageSrc();
        this.uniforms = {
          uTime : { type : "1f", value : 0.0 },
          uDistortion : { type : "1f", value : 0.0 },
          uDistortion2 : { type : "1f", value : 0.0 },
          uSpeed : { type : "1f", value : 0.1 }
        };
      }
    };

  })());

})(
  this.Blotter, this._, this.THREE, this.Detector, this.requestAnimationFrame, this.EventEmitter, this.GrowingPacker, this.setImmediate
);
