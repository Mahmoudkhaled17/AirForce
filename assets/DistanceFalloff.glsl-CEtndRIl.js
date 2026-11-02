import{F as e}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";import{E as t,k as n}from"./oitResolution.glsl-CqVd27g0.js";import{t as r}from"./SphereIntersect.glsl-Di-w3ZqF.js";import{t as i}from"./NoParameters-XZJ-8n06.js";var a=class extends i{constructor(){super(...arguments),this.atmosphereC=1}};function o(i){i.include(r),i.uniforms.add(new t(`atmosphereC`,e=>e.atmosphereC),new e(`cameraPosition`,e=>e.camera.eye)).code.add(n`float getDistanceFalloff(float dist, vec3 rayDir, float weight) {
if(dist == -1.0){
dist = 0.055 * sphereIntersect(cameraPosition, rayDir, atmosphereC).y;
}
return (1.0 - exp(-dist * weight));
}`)}export{o as n,a as t};