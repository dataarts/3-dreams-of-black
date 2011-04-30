var distortingShaderSource = {

  'distortingShader' : {

    uniforms: {
      "aspect": { type: "f", value: 0 },
      "near": { type: "f", value: 0 },
      "far": { type: "f", value: 0 },
      "xRange": { type: "f", value: 0 },
      "yRange": { type: "f", value: 0 },
      "sheet": { type: "t", value: 0, texture: null },
      "mouseRay": { type: "v3", value: new THREE.Vector3() },
      "deformer": { type: "v3", value: new THREE.Vector3() },
      "deformer0": { type: "v3", value: new THREE.Vector3() },
      "deformer1": { type: "v3", value: new THREE.Vector3() },
      "deformer2": { type: "v3", value: new THREE.Vector3() },
      "deformer3": { type: "v3", value: new THREE.Vector3() },
      "deformer4": { type: "v3", value: new THREE.Vector3() },
      "deformer5": { type: "v3", value: new THREE.Vector3() }

    },

    vertexShader: [

      "uniform vec3 mouseRay;",
      "uniform vec3 deformer;",
      "uniform vec3 deformer0;",
      "uniform vec3 deformer1;",
      "uniform vec3 deformer2;",
      "uniform vec3 deformer3;",
      "uniform vec3 deformer4;",
      "uniform vec3 deformer5;",
      "uniform float aspect;",
      "uniform float near;",
      "uniform float far;",

      "varying vec2 vUv;",
      "varying vec2 vUvPoly;",
      "varying vec3 pos;",
      //"varying vec3 posPoly;",
      "varying vec4 viewPos;",
      "varying vec4 modelPos;",
      "varying vec4 modelPosPoly;",
      //"varying vec4 viewPosPoly;",
      //"varying vec2 projPos;",
      //"varying vec2 projPosPoly;",
      "varying float distance;",
      "varying float distancePoly;",


      "void main() {",
      "vUv = uv;",
      "vUvPoly = uv+vec2(normal.x,normal.y);",

      "modelPos = modelViewMatrix * vec4( position, 1.0 );",
      "modelPosPoly = modelViewMatrix * vec4( position-vec3(-normal.x,normal.y,0.), 1.0 );",

      "float radius = 130.+(pow(modelPos.z,2.))/far;",
      "float distance0 = 1.2 * max(0.,1.-length(vec3(modelPos.xyz)-vec3(deformer0))/radius);",
      //"float distance1 = 0.8 * max(0.,1.-length(vec3(modelPos.xyz)-vec3(deformer1))/radius);",
      //"float distance2 = 0.7 * max(0.,1.-length(vec3(modelPos.xyz)-vec3(deformer2))/radius);",
      //"float distance3 = 0.6 * max(0.,1.-length(vec3(modelPos.xyz)-vec3(deformer3))/radius);",
      //"float distance4 = 0.5 * max(0.,1.-length(vec3(modelPos.xyz)-vec3(deformer4))/radius);",
      //"float distance5 = 0.4 * max(0.,1.-length(vec3(modelPos.xyz)-vec3(deformer5))/radius);",

      "float distRandom = normal.z*0.8+0.8;",

      "float distancePoly0 = 0.3 * max(0.,distRandom-length(vec3(modelPosPoly.xyz)-vec3(deformer0))/radius);",
      "float distancePoly1 = 0.9 * max(0.,distRandom-length(vec3(modelPosPoly.xyz)-vec3(deformer1))/radius);",
      "float distancePoly2 = 0.7 * max(0.,distRandom-length(vec3(modelPosPoly.xyz)-vec3(deformer2))/radius);",
      "float distancePoly3 = 0.5 * max(0.,distRandom-length(vec3(modelPosPoly.xyz)-vec3(deformer3))/radius);",
      "float distancePoly4 = 0.4 * max(0.,distRandom-length(vec3(modelPosPoly.xyz)-vec3(deformer4))/radius);",
      "float distancePoly5 = 0.4 * max(0.,distRandom-length(vec3(modelPosPoly.xyz)-vec3(deformer5))/radius);",

      //"distancePoly = max(0.,distRandom-length(vec3(modelPosPoly.xyz)-vec3(deformer))/radius);",
      //"distancePoly = max(distancePoly0,max(distancePoly1,max(distancePoly2,max(distancePoly3,max(distancePoly4,distancePoly5)))));",
      "distancePoly = distancePoly0+distancePoly1+distancePoly2+distancePoly3+distancePoly4+distancePoly5;",


      "modelPos.xy += normalize(modelPos.xy-vec2(deformer0.xy))*0.6*pow(distance0,2.)*(-modelPos.z/10.);",
      //"modelPos.xy += normalize(modelPos.xy-vec2(deformer1.xy))*0.6*pow(distance1,2.)*(-modelPos.z/10.);",
      //"modelPos.xy += normalize(modelPos.xy-vec2(deformer2.xy))*0.6*pow(distance2,2.)*(-modelPos.z/10.);",
      //"modelPos.xy += normalize(modelPos.xy-vec2(deformer3.xy))*0.6*pow(distance3,2.)*(-modelPos.z/10.);",
      //"modelPos.xy += normalize(modelPos.xy-vec2(deformer4.xy))*0.6*pow(distance4,2.)*(-modelPos.z/10.);",
      //"modelPos.xy += normalize(modelPos.xy-vec2(deformer5.xy))*0.6*pow(distance5,2.)*(-modelPos.z/10.);",

      "viewPos = projectionMatrix * modelPos;",


      "gl_Position = viewPos;",

      "}"

    ].join("\n"),

    fragmentShader: [
      "uniform sampler2D sheet;",

      //"uniform vec2 mouseRay;",
      "varying vec2 vUv;",
      "varying vec2 vUvPoly;",
      //"varying vec3 pos;",
      //"varying vec3 posPoly;",
      //"varying vec4 viewPos;",
      //"varying vec4 viewPosPoly;",
      //"varying vec2 projPos;",
      //"varying vec2 projPosPoly;",

      //"varying float distance;",
      "varying float distancePoly;",

      "void main() {",
      "vec4 c = texture2D( sheet, vec2( vUv.x, vUv.y ) );",
      "vec4 cPoly = texture2D( sheet, vec2( vUvPoly.x, vUvPoly.y ) );",
      "if ((distancePoly)>0.7) c = cPoly; ",
      "if (c.a<=0.1) discard;",
      "else gl_FragColor = c;",
      "}"

    ].join("\n")

  }

};