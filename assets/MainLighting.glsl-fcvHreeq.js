import{F as e}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";import{k as t}from"./oitResolution.glsl-CqVd27g0.js";function n(t){t.uniforms.add(new e(`mainLightDirection`,e=>e.lighting.mainLight.direction))}function r(t){t.uniforms.add(new e(`mainLightIntensity`,e=>e.lighting.mainLight.intensity))}function i(e){n(e),r(e),e.code.add(t`vec3 applyShading(vec3 shadingNormal, float shadow) {
float dotVal = clamp(dot(shadingNormal, mainLightDirection), 0.0, 1.0);
return mainLightIntensity * ((1.0 - shadow) * dotVal);
}`)}export{r as n,n as r,i as t};