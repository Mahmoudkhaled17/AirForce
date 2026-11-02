import{T as e}from"./mathUtils-D79yUFwW.js";import{D as t,E as n,O as r,T as i,a,i as o,k as s,r as c,w as l,y as u}from"./oitResolution.glsl-CqVd27g0.js";function d(e,t){switch(t.textureCoordinateType){case 1:e.attributes.add(`uv0`,`vec2`),e.varyings.add(`vuv0`,`vec2`),e.vertex.code.add(s`void forwardTextureCoordinates() { vuv0 = uv0; }`);return;case 2:e.attributes.add(`uv0`,`vec2`),e.attributes.add(`uvRegion`,`vec4`),e.varyings.add(`vuv0`,`vec2`),e.varyings.add(`vuvRegion`,`vec4`),e.vertex.code.add(s`void forwardTextureCoordinates() {
vuv0 = uv0;
vuvRegion = uvRegion;
}`);return;default:t.textureCoordinateType;case 0:e.vertex.code.add(s`void forwardTextureCoordinates() {}`);return;case 3:return}}function f(e){e.fragment.code.add(s`vec4 textureAtlasLookup(sampler2D tex, vec2 textureCoordinates, vec4 atlasRegion) {
vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;
float maxdUV = 0.125;
vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
return textureGrad(tex, uvAtlas, dUVdx, dUVdy);
}`)}function p(e,t){let{textureCoordinateType:n}=t;if(n===0||n===3)return;e.include(d,t);let r=n===2;r&&e.include(f),e.fragment.code.add(s`
    vec4 textureLookup(sampler2D tex, vec2 uv) {
      return ${r?`textureAtlasLookup(tex, uv, vuvRegion)`:`texture(tex, uv)`};
    }
  `)}var m=class extends t{constructor(e,t,n){super(e,`float`,2,(r,i,a)=>r.setUniform1f(e,t(i,a),n))}};function h(t,d){if(!u(d.output))return;t.fragment.include(c);let{emissionSource:f,hasEmissiveTextureTransform:h,bindType:g}=d,_=f===3||f===4||f===5;_&&(t.include(p,d),t.fragment.uniforms.add(g===1?new i(`texEmission`,e=>e.textureEmissive):new l(`texEmission`,e=>e.textureEmissive)));let v=f===2||_;v&&t.fragment.uniforms.add(g===1?new o(`emissiveBaseColor`,e=>e.emissiveBaseColor):new a(`emissiveBaseColor`,e=>e.emissiveBaseColor));let y=f!==0;if(y&&f!==7&&f!==6&&f!==4&&f!==5){let r=t=>e(t??0,0,16);t.fragment.uniforms.add(g===1?new n(`emissiveStrength`,e=>r(e.emissiveStrength)):new m(`emissiveStrength`,e=>r(e.emissiveStrength)))}let b=f===7,x=f===5,S=f===1||f===6||b;t.fragment.code.add(s`
    vec4 getEmissions(vec3 symbolColor) {
      vec4 emissions = ${v?x?`emissiveSource == 0 ? vec4(emissiveBaseColor, 1.0): vec4(linearizeGamma(symbolColor), 1.0)`:`vec4(emissiveBaseColor, 1.0)`:S?b?`emissiveSource == 0 ? vec4(0.0): vec4(linearizeGamma(symbolColor), 1.0)`:`vec4(linearizeGamma(symbolColor), 1.0)`:`vec4(0.0)`};
      ${r(_,`${r(x,`if(emissiveSource == 0) {\n              vec4 emissiveFromTex = textureLookup(texEmission, ${h?`emissiveUV`:`vuv0`});\n              emissions *= vec4(linearizeGamma(emissiveFromTex.rgb), emissiveFromTex.a);\n           }`,`vec4 emissiveFromTex = textureLookup(texEmission, ${h?`emissiveUV`:`vuv0`});\n           emissions *= vec4(linearizeGamma(emissiveFromTex.rgb), emissiveFromTex.a);`)}\n        emissions.a = emissions.rgb == vec3(0.0) ? 0.0: emissions.a;`)}
      ${r(y,`emissions.rgb *= emissiveStrength * ${s.float(1)};`)}
      return emissions;
    }
  `)}export{d as i,m as n,p as r,h as t};