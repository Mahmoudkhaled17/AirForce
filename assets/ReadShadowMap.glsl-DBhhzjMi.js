import{c as e}from"./vec3f64-DIOQknMY.js";import{d as t}from"./VertexColor.glsl-CtSC4iER.js";import{O as n,k as r,y as i}from"./oitResolution.glsl-CqVd27g0.js";import{c as a,d as o,l as s,s as c}from"./SnowCover.glsl-Dsn1B9ps.js";import{C as l,P as u}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";import{t as d}from"./NoParameters-XZJ-8n06.js";function f(e,a){let o=i(a.output)&&a.receiveShadows;o&&t(e,!0),e.vertex.code.add(r`
    void forwardLinearDepthToReadShadowMap() { ${n(o,`forwardLinearDepth(gl_Position.w);`)} }
  `)}var p=class extends d{constructor(){super(...arguments),this.origin=e()}};function m(e,t){t.receiveShadows&&e.fragment.include(s),g(e,t)}function h(e,t){t.receiveShadows&&e.fragment.include(o),g(e,t)}function g(e,t){e.fragment.uniforms.add(new u(`lightingGlobalFactor`,e=>e.lighting.globalFactor));let{hasShadowHighlights:i,receiveShadows:a,spherical:o}=t;e.include(f,t),a&&_(e.fragment,i),e.fragment.code.add(r`
    float readShadow(float additionalAmbientScale, vec3 vpos) {
      return ${a?`max(lightingGlobalFactor * (1.0 - additionalAmbientScale), readShadowMap(vpos, linearDepth))`:n(o,`lightingGlobalFactor * (1.0 - additionalAmbientScale)`,`0.0`)};
    }
  `)}function _(e,t){y(e,t),v(e)}function v(e){e.code.add(r`float readShadowMap(const in vec3 _worldPos, float _linearDepth) {
vec3 uvzShadow = calculateUVZShadow(_worldPos, _linearDepth, textureSize(shadowMap, 0));
return readShadowMaps(uvzShadow);
}`)}function y(e,t){e.include(a),e.uniforms.add(b()),t&&e.uniforms.add(new l(`shadowHighlight`,({shadowHighlight:e})=>e?.getTexture())),e.code.add(r`
    float readShadowMaps(const in vec3 uvzShadow) {
      if (uvzShadow.z < 0.0) {
        return 0.0;
      }

      float shadow1 = readShadowMapUVZ(uvzShadow, shadowMap);
      ${n(t,`float shadow2 = texelFetch(shadowHighlight, ivec2(gl_FragCoord.xy), 0).r;
         return shadow1 > shadow2 ? shadow1 : shadow2;`,`return shadow1;`)}
    }
  `)}function b(){return new c(`shadowMap`,({shadowMap:e})=>e.getOutput(5)??e.getOutput(7))}export{p as i,h as n,y as r,m as t};