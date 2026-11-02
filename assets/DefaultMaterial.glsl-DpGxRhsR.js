import{G as e,I as t,J as n,K as r,N as i,W as a,X as o,Y as s,Z as c,a as l,at as u,f as d,g as f,h as p,i as ee,it as te,m as ne,n as re,o as ie,p as ae,r as oe,t as m}from"./SnowCover.glsl-Dsn1B9ps.js";import{E as h,O as g,T as _,i as v,k as y,y as b}from"./oitResolution.glsl-CqVd27g0.js";import{At as x,B as S,I as C,O as w,U as T,W as E,Y as D,k as O,y as k}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";import{n as A,t as j}from"./VertexColor.glsl-CtSC4iER.js";import{i as M}from"./Emissions.glsl-CqIxN1Of.js";import{o as N}from"./BooleanBindUniform-CAe3a7Ur.js";import{n as P}from"./MainLighting.glsl-fcvHreeq.js";import{n as F,t as I}from"./ReadShadowMap.glsl-DBhhzjMi.js";import{m as se}from"./SceneLighting-DfZMo4es.js";import{t as L}from"./ShaderBuilder-bR6MCNi4.js";import{t as R}from"./AlphaCutoff-Diw6w_WO.js";function z(z){let B=new L,{attributes:V,vertex:H,fragment:U,varyings:W}=B,{output:G,normalType:K,offsetBackfaces:q,spherical:ce,snowCover:J,pbrMode:Y,textureAlphaPremultiplied:le,instancedDoublePrecision:ue,hasVertexColors:X,hasVertexTangents:Z,hasColorTexture:Q,hasNormalTexture:de,hasNormalTextureTransform:fe,hasColorTextureTransform:pe}=z;if(O(H,z),V.add(`position`,`vec3`),H.inputs.add(`position`,()=>`position`),W.add(`vpos`,`vec3`,{invariant:!0}),B.include(C,z),B.include(s,z),B.include(N,z),B.include(re,z),!b(G))return B.include(e,z),B;B.include(l,z),B.include(ee,z),B.include(oe,z),B.include(ie,z),w(H,z),B.include(u,z),B.include(A);let $=K===0||K===1;return $&&q&&B.include(c),B.include(a,z),B.include(te,z),B.include(o,z),W.add(`vPositionLocal`,`vec3`),B.include(M,z),B.include(n,z),B.include(j,z),H.uniforms.add(new S(`externalColor`,e=>e.externalColor,{supportsNaN:!0})),W.add(`vcolorExt`,`vec4`),H.include(E),H.include(T),B.include(ue?I:F,z),H.main.add(y`
    forwardVertexColor();

    MaskedColor maskedColor =
      applySymbolColor(applyVVColor(applyInstanceColor(createMaskedFromNaNColor(externalColor))));

    vcolorExt = maskedColor.color;
    forwardColorMixMode(maskedColor.mask);

    vpos = getVertexInLocalOriginSpace();
    vPositionLocal = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    ${g($,`vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`)}
    vpos = addVerticalOffset(vpos, localOrigin);
    ${g(Z,`vTangent = dpTransformVertexTangent(tangent);`)}
    gl_Position = transformPosition(proj, view, vpos);
    ${g($&&q,`gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);`)}

    forwardTextureCoordinates();
    forwardColorUV();
    forwardNormalUV();
    forwardEmissiveUV();
    forwardOcclusionUV();
    forwardMetallicRoughnessUV();

    if (opacityMixMode != ${y.int(x.ignore)} && vcolorExt.a < ${y.float(R)}) {
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
    }
    forwardLinearDepthToReadShadowMap();
  `),U.include(f,z),U.include(t,z),B.include(r,z),U.include(D,z),B.include(k,z),w(U,z),U.uniforms.add(H.uniforms.get(`localOrigin`),new v(`ambient`,e=>e.ambient),new v(`diffuse`,e=>e.diffuse),new h(`opacity`,e=>e.opacity),new h(`layerOpacity`,e=>e.layerOpacity)),Q&&U.uniforms.add(new _(`tex`,e=>e.texture)),B.include(d,z),U.include(i,z),U.include(se),B.include(ae,z),U.include(m,z),p(U),ne(U),P(U),U.main.add(y`
    discardBySlice(vpos);
    ${Q?y`
            vec4 texColor = texture(tex, ${pe?`colorUV`:`vuv0`});
            ${g(le,`texColor.rgb /= texColor.a;`)}
            discardOrAdjustAlpha(texColor);`:y`vec4 texColor = vec4(1.0);`}
    shadingParams.viewDirection = normalize(vpos - cameraPosition);
    ${K===2?y`vec3 normal = screenDerivativeNormal(vPositionLocal);`:y`shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

    vec3 posWorld = vpos + localOrigin;

    float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
    float shadow = readShadow(additionalAmbientScale, vpos);

    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(${g(X,`vColor.rgb *`)} matColor, texColor.rgb, vcolorExt.rgb, colorMixMode);
    float opacity_ = layerOpacity * mixExternalOpacity(${g(X,`vColor.a * `)} opacity, texColor.a, vcolorExt.a, opacityMixMode);

    ${de?`mat3 tangentSpace = computeTangentSpace(${Z?`normal`:`normal, vpos, vuv0`});\n           vec3 shadingNormal = computeTextureNormal(tangentSpace, ${fe?`normalUV`:`vuv0`});`:`vec3 shadingNormal = normal;`}
    vec3 normalGround = ${ce?`normalize(posWorld);`:`vec3(0.0, 0.0, 1.0);`}

    ${g(J,y`
          float snow = getSnow(normal, normalGround);
          albedo = mix(albedo, vec3(1), snow);
          shadingNormal = mix(shadingNormal, normal, snow);
          ssao = mix(ssao, 1.0, snow);`)}

    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

    ${Y===1||Y===2?y`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
            ${g(J,`mrr = applySnowToMRR(mrr, snow);`)}
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, additionalAmbientIrradiance);`:y`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${g(J,`, snow`)});
  `),B}var B=Object.freeze(Object.defineProperty({__proto__:null,build:z},Symbol.toStringTag,{value:`Module`}));export{z as n,B as t};