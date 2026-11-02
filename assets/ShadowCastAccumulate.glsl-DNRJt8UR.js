import{y as e}from"./SceneLighting-DfZMo4es.js";import{t}from"./calculateUVZShadowFromDepth.glsl-DXf3mtmR.js";import{r as n}from"./ReadShadowMap.glsl-DBhhzjMi.js";import{k as r}from"./oitResolution.glsl-CqVd27g0.js";import{C as i}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";import{t as a}from"./ShaderBuilder-bR6MCNi4.js";var o=255,s=1/255;function c(o){let c=new a,{fragment:l}=c;c.include(e),c.include(t),l.include(n,!1),l.constants.add(`sampleValue`,`float`,s);let u=o.index===1?`vec2`:`float`;return c.outputs.add(`sampleCount`,u),l.uniforms.add(new i(`depthMap`,e=>e.depth?.attachment)).main.add(r`
    sampleCount = ${u}(0.0);

    vec3 uvzShadow = calculateUVZShadowFromDepth(uv, textureSize(shadowMap,0), depthMap);
    // The shadow map sampler returns a value between 0 and 1, we take the midpoint as we count discrete samples
    bool shadow = readShadowMaps(uvzShadow) > 0.5;
    if (shadow) {
      sampleCount = ${u}(sampleValue); // Add 1 to the sample count
    }
  `),c}var l=Object.freeze(Object.defineProperty({__proto__:null,ShadowCastMaxSamples:255,build:c},Symbol.toStringTag,{value:`Module`}));export{c as n,o as r,l as t};