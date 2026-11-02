import{E as e,w as t,y as n}from"./aaBoundingRect-vMG0VGl_.js";import{o as r}from"./vec4f64-CjgU5APJ.js";import{S as i}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";import{D as a,E as o,T as s,k as c,y as l}from"./oitResolution.glsl-CqVd27g0.js";import{t as u}from"./Texture2DUintPassUniform-Bdl39S_8.js";import{n as d,r as f}from"./MainLighting.glsl-fcvHreeq.js";import{t as p}from"./WaterColor.glsl-Cs5SN9rc.js";var m=class extends a{constructor(e,t,n){super(e,`vec4`,2,(r,i,a)=>r.setUniform4fv(e,t(i,a),n))}};function h(e,t){t.output===10&&(e.include(i,t),e.fragment.code.add(c`
    void calculateOcclusionAndOutputHighlight(uvec2 highlightToAdd) {
      uint levelBits = readLevelBits(highlightToAdd, highlightLevel);
      if ((levelBits & 1u) == 0u) discard;
      outputHighlight(isHighlightOccluded());
    }
  `))}function g(e,t){let{vertex:n,fragment:r}=e;n.uniforms.add(new m(`overlayTexOffset`,(e,n)=>S(t.spherical,e,n)),new m(`overlayTexScale`,(e,n)=>C(t.spherical,e,n))),r.uniforms.add(new m(`overlayTexOffset`,(e,n)=>S(t.spherical,e,n)),new m(`overlayTexScale`,(e,n)=>C(t.spherical,e,n))),r.constants.add(`overlayOpacity`,`float`,1),r.uniforms.add(new s(`ovColorTex`,(e,t)=>_(e,t))),b(e,t)}function _(e,t){return e.identifier===0&&l(t.output)?e.occludedGround?t.overlay?.allSourcesOccluders?t.overlay?.getTexture(1):t.overlay?.getTexture(4):t.overlay?.getTexture(1):e.identifier===0&&t.output===11?t.overlay?.getTexture(5):e.identifier===2?t.overlay?.getTexture(2):null}function v(e,t){let{vertex:n,fragment:r}=e;n.uniforms.add(new T(`overlayTexOffset`),new T(`overlayTexScale`)),r.uniforms.add(new o(`overlayOpacity`,e=>e.overlayOpacity)),t.output!==10&&r.uniforms.add(new s(`ovColorTex`,(e,t)=>t.overlay?.getTexture(e.overlayContent))),b(e,t)}function y(e,t){switch(e){case 0:case 1:case 2:return t.slot!==9||t.overlay?.allSourcesOccluders?0:4;case 3:case 4:return 0;case 10:return 2;case 5:case 7:case 8:case 9:return null;case 11:return 5}return null}function b(e,t){let{hasWater:n,output:r}=t;n&&e.include(p,t);let{vertex:i,fragment:a,varyings:o}=e;o.add(`vtcOverlay`,`vec4`);let s=r===10;i.code.add(c`void setOverlayVTC(in vec2 uv) {
vtcOverlay = vec4(uv, uv) * overlayTexScale + overlayTexOffset;
}`),a.code.add(c`bool isValid(vec2 uv, vec2 dxdy) {
return (uv.x >= 0.0 + dxdy.x) && (uv.x <= 1.0 - dxdy.x) && (uv.y >= 0.0 + dxdy.y) && (uv.y <= 1.0 - dxdy.y);
}
vec4 getOverlayColor(sampler2D ov0Tex, vec4 texCoords) {
vec4 color0 = texture(ov0Tex, vec2(texCoords.x * 0.5, texCoords.y));
vec4 color1 = texture(ov0Tex, vec2(texCoords.z * 0.5 + 0.5, texCoords.w));
bool isValid0 = isValid(texCoords.xy, fwidth(texCoords.xy));
bool isValid1 = isValid(texCoords.zw, vec2(0.0, 0.0));
return mix(color1 * float(isValid1), color0, float(isValid0));
}`),s?a.uniforms.add(new u(`overlayHighlightTexture`,(e,t)=>t.overlay?.getTexture(2))).code.add(c`uvec2 getAllOverlayHighlightValuesEncoded() {
vec4 texCoords = vtcOverlay;
vec2 uvInner = texCoords.xy;
vec2 uvOuter = texCoords.zw;
bool isValidInner = isValid(uvInner, fwidth(uvInner));
bool isValidOuter = isValid(uvOuter, vec2(0.0, 0.0));
vec2 texelCoordInner = uvInner * vec2(0.5, 1.0);
vec2 texelCoordOuter = uvOuter * vec2(0.5, 1.0) + vec2(0.5,0.0);
vec2 texDim =  vec2(textureSize(overlayHighlightTexture, 0));
uvec2 texelValueInner = texelFetch(overlayHighlightTexture, ivec2(texelCoordInner * texDim), 0).rg;
uvec2 texelValueOuter = texelFetch(overlayHighlightTexture, ivec2(texelCoordOuter * texDim), 0).rg;
return
isValidInner ? texelValueInner :
isValidOuter ? texelValueOuter :
uvec2(0);
}`):(a.code.add(c`vec4 getCombinedOverlayColor() {
return overlayOpacity * getOverlayColor(ovColorTex, vtcOverlay);
}`),a.code.add(c`vec4 getOverlayColorTexel() {
vec4 texCoords = vtcOverlay;
vec2 texDim =  vec2(textureSize(ovColorTex, 0));
vec4 color0 = texelFetch(ovColorTex, ivec2(vec2(texCoords.x * 0.5, texCoords.y) * texDim), 0);
vec4 color1 = texelFetch(ovColorTex, ivec2(vec2(texCoords.z * 0.5 + 0.5, texCoords.w) * texDim), 0);
bool isValid0 = isValid(texCoords.xy, fwidth(texCoords.xy));
bool isValid1 = isValid(texCoords.zw, vec2(0.0, 0.0));
return mix(color1 * float(isValid1), color0, float(isValid0));
}`)),n&&(f(a),d(a),a.code.add(c`vec4 getOverlayWaterColor(vec4 maskInput, vec4 colorInput, vec3 vposEyeDir,
float shadow, vec3 localUp, mat3 tbn, vec3 position, vec3 positionWorld) {
vec3 n = normalize(tbn *  (2.0 * maskInput.rgb - vec3(1.0)));
vec3 v = vposEyeDir;
vec3 final = getWaterColor(n, v, mainLightDirection, colorInput.rgb, mainLightIntensity, localUp, 1.0 - shadow, maskInput.w, position, positionWorld);
return vec4(final, colorInput.w);
}`))}function x(e,t){return e.overlay?.overlays[t]?.extent}function S(r,i,a){let o=w,s=r&&!i.useENUForGlobalOverlayUV,c=s?0:i.toMapSpace[0],l=s?0:i.toMapSpace[1],u=(r,i)=>{let s=x(a,i);e(s)&&(o[r+0]=(c-s[0])/n(s),o[r+1]=(l-s[1])/t(s))};return u(0,0),u(2,1),o}function C(r,i,a){let o=w,s=r&&!i.useENUForGlobalOverlayUV,c=s?1:i.toMapSpace[2],l=s?1:i.toMapSpace[3],u=(r,i)=>{let s=x(a,i);e(s)&&(o[r+0]=c/n(s),o[r+1]=l/t(s))};return u(0,0),u(2,1),o}var w=r(),T=class extends a{constructor(e){super(e,`vec4`)}};export{m as a,h as i,y as n,g as r,v as t};