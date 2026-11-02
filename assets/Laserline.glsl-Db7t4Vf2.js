import{c as e,l as t}from"./BooleanBindUniform-CAe3a7Ur.js";import{o as n}from"./Blit-CfK4Ixb1.js";import{E as r,T as i,i as a,k as o}from"./oitResolution.glsl-CqVd27g0.js";import{C as s}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";function c(c,l){let u=c.fragment;u.include(t),c.include(e),u.include(n),u.uniforms.add(new r(`globalAlpha`,e=>e.globalAlpha),new a(`glowColor`,e=>e.glowColor),new r(`glowWidth`,(e,t)=>e.glowWidth*t.camera.pixelRatio),new r(`glowFalloff`,e=>e.glowFalloff),new a(`innerColor`,e=>e.innerColor),new r(`innerWidth`,(e,t)=>e.innerWidth*t.camera.pixelRatio),new s(`depthMap`,e=>e.depth?.attachment),new i(`normalMap`,e=>e.normals)),u.code.add(o`vec4 premultipliedColor(vec3 rgb, float alpha) {
return vec4(rgb * alpha, alpha);
}`),u.code.add(o`vec4 laserlineProfile(float dist) {
if (dist > glowWidth) {
return vec4(0.0);
}
float innerAlpha = (1.0 - smoothstep(0.0, innerWidth, dist));
float glowAlpha = pow(max(0.0, 1.0 - dist / glowWidth), glowFalloff);
return blendColorsPremultiplied(
premultipliedColor(innerColor, innerAlpha),
premultipliedColor(glowColor, glowAlpha)
);
}`),u.code.add(o`bool laserlineReconstructFromDepth(out vec3 pos, out vec3 normal, out float angleCutoffAdjust, out float depthDiscontinuityAlpha) {
float depth = depthFromTexture(depthMap, uv);
if (depth == 1.0) {
return false;
}
float linearDepth = linearizeDepth(depth);
pos = reconstructPosition(gl_FragCoord.xy, linearDepth);
float minStep = 6e-8;
float depthStep = clamp(depth + minStep, 0.0, 1.0);
float linearDepthStep = linearizeDepth(depthStep);
float depthError = abs(linearDepthStep - linearDepth);
vec3 normalReconstructed = normalize(cross(dFdx(pos), dFdy(pos)));
vec3 normalFromTexture = normalize(texture(normalMap, uv).xyz * 2.0 - 1.0);
float blendFactor = smoothstep(0.15, 0.2, depthError);
normal = normalize(mix(normalReconstructed, normalFromTexture, blendFactor));
angleCutoffAdjust = mix(0.0, 0.004, blendFactor);
float ddepth = fwidth(linearDepth);
depthDiscontinuityAlpha = 1.0 - smoothstep(0.0, 0.01, -ddepth / linearDepth);
return true;
}`),l.contrastControlEnabled?u.uniforms.add(new i(`frameColor`,(e,t)=>e.colors),new r(`globalAlphaContrastBoost`,e=>e.globalAlphaContrastBoost)).code.add(o`float rgbToLuminance(vec3 color) {
return dot(vec3(0.2126, 0.7152, 0.0722), color);
}
vec4 laserlineOutput(vec4 color) {
float backgroundLuminance = rgbToLuminance(texture(frameColor, uv).rgb);
float alpha = clamp(globalAlpha * max(backgroundLuminance * globalAlphaContrastBoost, 1.0), 0.0, 1.0);
return color * alpha;
}`):u.code.add(o`vec4 laserlineOutput(vec4 color) {
return color * globalAlpha;
}`)}export{c as t};