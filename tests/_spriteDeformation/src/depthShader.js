var depthShaderSource = {

  'depthShader' : {

    uniforms: {
      "aspect": { type: "f", value: 0 },
      "near": { type: "f", value: 0 },
      "far": { type: "f", value: 0 }
    },

    vertexShader: [

      "uniform float xRange;",
      "uniform float yRange;",
      "uniform float zRange;",
      "varying vec4 modelPos;",
      "varying vec3 viewPosNorm;",
      "varying vec2 vUv;",

      "void main() {",
      "vUv = uv;",

      "modelPos = modelViewMatrix * vec4( position, 1.0 );",

      "viewPosNorm.x = 0.5+((modelPos.x/xRange)/2.);",
      "viewPosNorm.y = 0.5+((modelPos.y/yRange)/2.);",
      "viewPosNorm.z = (modelPos.z)/zRange;",

      "gl_Position = projectionMatrix * modelPos;",

      "}"

    ].join("\n"),

    fragmentShader: [
      "uniform sampler2D sheet;",

      "varying vec3 viewPosNorm;",
      "varying vec2 vUv;",

      "void main() {",
      "vec4 c = texture2D( sheet, vec2( vUv.x, vUv.y ) );",
      "gl_FragColor = vec4(viewPosNorm.x,viewPosNorm.y,-viewPosNorm.z,c.a);",
      "}"

    ].join("\n")

  }

};