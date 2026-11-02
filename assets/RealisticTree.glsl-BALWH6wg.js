import{G as e,I as t,J as n,K as r,N as i,X as a,Y as o,Z as s,at as c,f as l,g as u,h as d,i as f,m as p,n as m,t as h}from"./SnowCover.glsl-Dsn1B9ps.js";import{E as g,O as _,T as v,i as y,k as b,y as x}from"./oitResolution.glsl-CqVd27g0.js";import{At as S,B as C,I as w,O as T,T as E,U as D,W as O,Y as k,k as A,y as j}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";import{n as M,t as N}from"./VertexColor.glsl-CtSC4iER.js";import{i as P}from"./Emissions.glsl-CqIxN1Of.js";import{o as F}from"./BooleanBindUniform-CAe3a7Ur.js";import{n as ee,r as I}from"./MainLighting.glsl-fcvHreeq.js";import{n as L,t as R}from"./ReadShadowMap.glsl-DBhhzjMi.js";import{m as z}from"./SceneLighting-DfZMo4es.js";import{t as B}from"./ShaderBuilder-bR6MCNi4.js";function V(V){let H=new B,{attributes:U,vertex:W,fragment:G,varyings:K}=H,{output:q,offsetBackfaces:J,pbrMode:Y,snowCover:X,spherical:Z}=V,Q=Y===1||Y===2;if(A(W,V),U.add(`position`,`vec3`),W.inputs.add(`position`,()=>`position`),K.add(`vpos`,`vec3`,{invariant:!0}),H.include(w,V),H.include(o,V),H.include(F,V),H.include(m,V),!x(q))return H.include(e,V),H;H.include(f,V),T(H.vertex,V),H.include(c,V),H.include(M),J&&H.include(s),K.add(`vNormalWorld`,`vec3`),K.add(`localvpos`,`vec3`,{invariant:!0}),H.include(P,V),H.include(n,V),H.include(a,V),H.include(N,V),W.include(O),W.include(D),W.uniforms.add(new C(`externalColor`,e=>e.externalColor,{supportsNaN:!0})),K.add(`vcolorExt`,`vec4`),H.include(V.instancedDoublePrecision?R:L,V),W.include(E),W.main.add(b`
    forwardVertexColor();

    MaskedColor maskedColorExt =
      applySymbolColor(applyVVColor(applyInstanceColor(createMaskedFromNaNColor(externalColor))));

    vcolorExt = maskedColorExt.color;
    forwardColorMixMode(maskedColorExt.mask);

    bool alphaCut = opacityMixMode != ${b.int(S.ignore)} && vcolorExt.a < alphaCutoff;
    vpos = getVertexInLocalOriginSpace();

    localvpos = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
    vpos = addVerticalOffset(vpos, localOrigin);
    vec4 basePosition = transformPosition(proj, view, vpos);

    forwardTextureCoordinates();
    forwardColorUV();
    forwardEmissiveUV();
    forwardLinearDepthToReadShadowMap();
    gl_Position = alphaCut ? vec4(1e38, 1e38, 1e38, 1.0) :
    ${_(J,`offsetBackfacingClipPosition(basePosition, vpos, vNormalWorld, cameraPosition);`,`basePosition;`)}
  `);let{hasColorTexture:$,hasColorTextureTransform:te}=V;return G.include(u,V),G.include(t,V),H.include(r,V),G.include(k,V),H.include(j,V),T(G,V),I(G),d(G),p(G),G.uniforms.add(W.uniforms.get(`localOrigin`),W.uniforms.get(`view`),new y(`ambient`,e=>e.ambient),new y(`diffuse`,e=>e.diffuse),new g(`opacity`,e=>e.opacity),new g(`layerOpacity`,e=>e.layerOpacity)),$&&G.uniforms.add(new v(`tex`,e=>e.texture)),H.include(l,V),G.include(i,V),G.include(z),G.include(h,V),ee(G),G.main.add(b`
      discardBySlice(vpos);
      vec4 texColor = ${$?`texture(tex, ${te?`colorUV`:`vuv0`})`:` vec4(1.0)`};
      ${_($,`${_(V.textureAlphaPremultiplied,`texColor.rgb /= texColor.a;`)}\n        discardOrAdjustAlpha(texColor);`)}
      vec3 viewDirection = normalize(vpos - cameraPosition);
      applyPBRFactors();
      float ssao = evaluateAmbientOcclusionInverse();
      ssao *= getBakedOcclusion();

      float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
      vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
      float shadow = readShadow(additionalAmbientScale, vpos);
      vec3 matColor = max(ambient, diffuse);
      ${V.hasVertexColors?b`vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, colorMixMode);
             float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, opacityMixMode);`:b`vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, colorMixMode);
             float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, opacityMixMode);`}

      vec3 shadingNormal = normalize(vNormalWorld);
      vec3 groundNormal = ${Z?`normalize(vpos + localOrigin)`:`vec3(0.0, 0.0, 1.0)`};

      ${_(X,`vec3 faceNormal = screenDerivativeNormal(vpos);
         float snow = getRealisticTreeSnow(faceNormal, shadingNormal, groundNormal);
         albedo = mix(albedo, vec3(1), snow);`)}

      ${b`albedo *= 1.2;
             vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
             float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
             float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
             float treeRadialFalloff = vColor.r;
             float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
             additionalLight += backLightFactor * mainLightIntensity;`}

      ${Q?b`float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
            ${_(X,`mrr = applySnowToMRR(mrr, snow);`)}
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, groundNormal, mrr, additionalAmbientIrradiance);`:b`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
      vec4 finalColor = vec4(shadedColor, opacity_);
      outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${_(X,`, 1.0`)});`),H}var H=Object.freeze(Object.defineProperty({__proto__:null,build:V},Symbol.toStringTag,{value:`Module`}));export{H as n,V as t};