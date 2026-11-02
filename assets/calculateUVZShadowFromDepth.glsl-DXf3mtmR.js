import{C as e,S as t}from"./mat4-i5hbKyBt.js";import{t as n}from"./mat4f64-E_FXCKxO.js";import{c as r,l as i}from"./BooleanBindUniform-CAe3a7Ur.js";import{l as a}from"./SnowCover.glsl-Dsn1B9ps.js";import{k as o}from"./oitResolution.glsl-CqVd27g0.js";import{N as s}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";function c(e){e.fragment.include(a),l(e)}function l(n){n.fragment.include(i),n.include(r),n.fragment.uniforms.add(new s(`inverseViewMatrix`,({camera:n})=>t(u,e(u,n.viewMatrix,n.center)))).code.add(o`vec3 calculateUVZShadowAndPixelPosFromDepth(
in vec2 _uv,
ivec2 shadowMapSize,
in sampler2D _depthMap,
out vec4 currentPixelPos
) {
float depth = depthFromTexture(_depthMap, _uv);
if (depth >= 1.0 || depth <= 0.0) {
return invalidShadowmapUVZ;
}
float currentPixelDepth = linearizeDepth(depth);
currentPixelPos = vec4(reconstructPosition(gl_FragCoord.xy, currentPixelDepth), 1.0);
vec4 worldSpacePos = inverseViewMatrix * currentPixelPos;
float linearDepth = -currentPixelDepth;
return calculateUVZShadow(worldSpacePos.xyz, linearDepth, shadowMapSize);
}
vec3 calculateUVZShadowFromDepth(
in vec2 _uv,
ivec2 shadowMapSize,
in sampler2D _depthMap
) {
vec4 currentPixelPos;
return calculateUVZShadowAndPixelPosFromDepth(_uv, shadowMapSize, _depthMap, currentPixelPos);
}`)}var u=n();export{c as t};