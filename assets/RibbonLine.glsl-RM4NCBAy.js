import{B as e,D as t,E as n,G as r,N as i,O as a,P as o,T as s,Y as ee,j as c,k as te,y as l}from"./TriangleTechniqueConfiguration-BNTuyEKP.js";import{c as u,l as d,t as ne,u as f}from"./MarkerSizing.glsl-zM0M9kpP.js";import{c as p,m,o as h,s as re}from"./SceneLighting-DfZMo4es.js";import{E as g,O as _,T as v,k as y}from"./oitResolution.glsl-CqVd27g0.js";import{n as b}from"./uuid-CxFjXsEJ.js";import{t as x}from"./uid-tFVEb1ZF.js";import{i as S,s as C}from"./enums-CsvnPRfA.js";import{s as w,t as T}from"./Texture-N_pG9QJE.js";import{l as E}from"./vec4-B-G2J025.js";import{o as D,r as O}from"./vec4f64-CjgU5APJ.js";import{t as k}from"./PositionOutsideClipSpace-CkuOwPTs.js";import{D as A}from"./vec2-C5dJMieJ.js";import{o as j}from"./vec2f64-IO40D2xB.js";import{i as M}from"./time-BzYz5R50.js";import{t as N}from"./ShaderBuilder-bR6MCNi4.js";var P={dash:[4,3],dot:[1,3],"long-dash":[8,3],"short-dash":[4,1],"short-dot":[1,1]},F={dash:P.dash,"dash-dot":[...P.dash,...P.dot],dot:P.dot,"long-dash":P[`long-dash`],"long-dash-dot":[...P[`long-dash`],...P.dot],"long-dash-dot-dot":[...P[`long-dash`],...P.dot,...P.dot],none:null,"short-dash":P[`short-dash`],"short-dash-dot":[...P[`short-dash`],...P[`short-dot`]],"short-dash-dot-dot":[...P[`short-dash`],...P[`short-dot`],...P[`short-dot`]],"short-dot":P[`short-dot`],solid:null},I=8,L=class{constructor(e,t,n){this.image=e,this.width=t,this.length=n,this.uuid=b()}};function R(e){return e!=null&&`image`in e}function z(e,t){return e==null?e:{pattern:e.slice(),pixelRatio:t}}function B(e){return{pattern:[e,e],pixelRatio:2}}function V(e){switch(e?.type){case`style`:return H(e.style);case`image`:return new L(e.image,e.width,e.length);case void 0:case null:return null}return null}function H(e){return e==null?null:z(F[e],I)}var U=class{constructor(e,t,n){this._createTexture=e,this._parametersKey=t,this._repository=new Map,this._orphanCache=n.newCache(`procedural-texture-repository:${x()}`,e=>e.dispose())}destroy(){for(let{texture:e}of this._repository.values())e.dispose();this._repository.clear(),this._orphanCache.destroy()}swap(e,t=null){let n=this._acquire(e);return this.release(t),n}release(e){if(e==null)return;let t=this._parametersKey(e),n=this._repository.get(t);if(n&&(n.refCount--,n.refCount===0)){this._repository.delete(t);let{texture:e}=n;this._orphanCache.put(t,e)}}_acquire(e){if(e==null)return null;let t=this._parametersKey(e),n=this._repository.get(t);if(n)return n.refCount++,n.texture;let r=this._orphanCache.pop(t)??this._createTexture(e),i=new W(r);return this._repository.set(t,i),r}},W=class{constructor(e){this.texture=e,this.refCount=1}};function G(e,t){return new U(t=>{if(R(t))return Y(e,t.image);let{data:n,textureSize:r}=K(t),i=new w(r,1);return i.dataType=C.FLOAT,i.pixelFormat=6403,i.internalFormat=S.R16F,i.wrapMode=10497,new T(e,i,n)},e=>R(e)?`image-${e.uuid}`:`${e.pattern.join(`,`)}-r${e.pixelRatio}`,t)}function K(e){let t=q(e),n=1/e.pixelRatio,r=J(e),i=[],a=1;for(let e of t){for(let t=0;t<e;t++){let r=a*(Math.min(t,e-1-t)+.5)*n;i.push(r)}a=-a}let o=Math.round(t[0]/2);return{data:new Float32Array([...i.slice(o),...i.slice(0,o)]),textureSize:r}}function q(e){return e.pattern.map(t=>Math.round(t*e.pixelRatio))}function J(e){if(e==null)return 1;let t=q(e);return Math.floor(t.reduce((e,t)=>e+t))}function Y(e,t){let{data:n,width:r,height:i}=t,a=new w(r,i);return a.dataType=C.UNSIGNED_BYTE,a.pixelFormat=6408,a.internalFormat=S.RGBA8,a.wrapMode={s:10497,t:33071},a.hasMipmap=!0,a.samplingMode=9987,new T(e,a,n)}function ie(e){return e==null?O:e.length===4?e:E(ae,e[0],e[1],e[2],1)}var ae=D();function oe(t,n){if(!n.stippleEnabled)return void t.fragment.code.add(y`float getStippleAlpha(float lineWidth) { return 1.0; }
void discardByStippleAlpha(float stippleAlpha, float threshold) {}
vec4 blendStipple(vec4 color, float stippleAlpha) { return color; }`);let r=!(n.draped&&n.stipplePreferContinuous),{vertex:i,fragment:s}=t;n.draped||(a(i,n),i.uniforms.add(new o(`worldToScreenPerDistanceRatio`,({camera:e})=>1/e.perScreenPixelRatio)).code.add(y`float computeWorldToScreenRatio(vec3 segmentCenter) {
float segmentDistanceToCamera = length(segmentCenter - cameraPosition);
return worldToScreenPerDistanceRatio / segmentDistanceToCamera;
}`)),t.varyings.add(`vStippleDistance`,`float`),t.varyings.add(`vStippleDistanceLimits`,`vec2`),t.varyings.add(`vStipplePatternStretch`,`float`),i.code.add(y`
    float discretizeWorldToScreenRatio(float worldToScreenRatio) {
      float step = ${y.float(se)};

      float discreteWorldToScreenRatio = log(worldToScreenRatio);
      discreteWorldToScreenRatio = ceil(discreteWorldToScreenRatio / step) * step;
      discreteWorldToScreenRatio = exp(discreteWorldToScreenRatio);
      return discreteWorldToScreenRatio;
    }
  `),c(i),i.code.add(y`
    vec2 computeStippleDistanceLimits(float startPseudoScreen, float segmentLengthPseudoScreen, float segmentLengthScreen, float patternLength) {

      // First check if the segment is long enough to support fully screen space patterns.
      // Force sparse mode for segments that are very large in screen space even if it is not allowed,
      // to avoid imprecision from calculating with large floats.
      if (segmentLengthPseudoScreen >= ${r?`patternLength`:`1e4`}) {
        // Round the screen length to get an integer number of pattern repetitions (minimum 1).
        float repetitions = segmentLengthScreen / (patternLength * pixelRatio);
        float flooredRepetitions = max(1.0, floor(repetitions + 0.5));
        float segmentLengthScreenRounded = flooredRepetitions * patternLength;

        float stretch = repetitions / flooredRepetitions;

        // We need to impose a lower bound on the stretch factor to prevent the dots from merging together when there is only 1 repetition.
        // 0.75 is the lowest possible stretch value for flooredRepetitions > 1, so it makes sense as lower bound.
        vStipplePatternStretch = max(0.75, stretch);

        return vec2(0.0, segmentLengthScreenRounded);
      }
      return vec2(startPseudoScreen, startPseudoScreen + segmentLengthPseudoScreen);
    }
  `),s.uniforms.add(new v(`stipplePatternTexture`,e=>e.stippleTexture),new g(`stipplePatternPixelSizeInv`,e=>1/X(e))),n.stippleOffColorEnabled&&s.uniforms.add(new e(`stippleOffColor`,e=>ie(e.stippleOffColor))),t.include(u),n.worldSizedImagePattern?(t.varyings.add(`vStippleV`,`float`),t.fragment.include(m),s.code.add(y`vec4 getStippleColor(out bool isClamped) {
vec2 aaCorrectedLimits = vStippleDistanceLimits + vec2(1.0, -1.0) / gl_FragCoord.w;
isClamped = vStippleDistance < aaCorrectedLimits.x || vStippleDistance > aaCorrectedLimits.y;
float u = vStippleDistance * stipplePatternPixelSizeInv;
float v = vStippleV == -1.0 ? 0.5 : vStippleV;
return texture(stipplePatternTexture, vec2(u, v));
}
vec4 getStippleColor() {
bool ignored;
return getStippleColor(ignored);
}
float getStippleSDF() {
vec4 color = getStippleColor();
return color.a == 0.0 ? -0.5 : 0.5;
}
float getStippleAlpha(float lineWidth) {
return getStippleColor().a;
}
vec4 blendStipple(vec4 color, float stippleAlpha) {
vec4 stippleColor = getStippleColor();
int mixMode  = 1;
vec3 col = mixExternalColor(color.rgb, vec3(1.0), stippleColor.rgb, mixMode);
float opacity = mixExternalOpacity(color.a, 1.0, stippleColor.a, mixMode);
return vec4(col, opacity);
}`)):s.code.add(y`
    float getStippleSDF(out bool isClamped) {
      float stippleDistanceClamped = noPerspectiveRead(clamp(vStippleDistance, vStippleDistanceLimits.x, vStippleDistanceLimits.y));
      float lineSizeInv = noPerspectiveRead(vLineSizeInv);

      vec2 aaCorrectedLimits = vStippleDistanceLimits + vec2(1.0, -1.0) / gl_FragCoord.w;
      isClamped = vStippleDistance < aaCorrectedLimits.x || vStippleDistance > aaCorrectedLimits.y;

      float u = stippleDistanceClamped * stipplePatternPixelSizeInv * lineSizeInv;
      u = fract(u);

      float sdf = texture(stipplePatternTexture, vec2(u, 0.5)).r;

      return (sdf - 0.5) * vStipplePatternStretch + 0.5;
    }

    float getStippleSDF() {
      bool ignored;
      return getStippleSDF(ignored);
    }

    float getStippleAlpha(float lineWidth) {
      bool isClamped;
      float stippleSDF = getStippleSDF(isClamped);
      float antiAliasedResult = clamp(stippleSDF * lineWidth + 0.5, 0.0, 1.0);
      return isClamped ? floor(antiAliasedResult + 0.5) : antiAliasedResult;
    }

    vec4 blendStipple(vec4 color, float stippleAlpha) {
      return ${n.stippleOffColorEnabled?`mix(color, stippleOffColor, stippleAlpha)`:`vec4(color.rgb, color.a * stippleAlpha)`};
    }
  `),s.code.add(y`
    void discardByStippleAlpha(float stippleAlpha, float threshold) {
     ${_(!n.stippleOffColorEnabled,`if (stippleAlpha < threshold) { discard; }`)}
    }
  `)}function X(e){let t=e.stipplePattern;return R(t)?t.length:t?J(t)/t.pixelRatio:1}var se=.4,ce=.1,Z=M(1),Q=M(1),le=1e3,ue=27e6;function de(e,t){let{hasAnimation:n,animation:r}=t;if(!n)return;let{attributes:i,varyings:a,vertex:o,fragment:s}=e;i.add(`timeStamps`,`vec4`),a.add(`vTimeStamp`,`float`),a.add(`vFirstTime`,`float`),a.add(`vLastTime`,`float`),a.add(`vTransitionType`,`float`),o.main.add(y`vTimeStamp = timeStamps.x;
vFirstTime = timeStamps.y;
vLastTime = timeStamps.z;
vTransitionType = timeStamps.w;`),r===3&&s.constants.add(`decayRate`,`float`,2.3),s.code.add(y`
    float getTrailOpacity(float x) {
      if (x < 0.0) {
        return 0.0;
      }

      ${fe(r)}
    }`),s.uniforms.add(new g(`timeElapsed`,e=>e.timeElapsed),new g(`trailLength`,e=>e.trailLength),new g(`speed`,e=>e.animationSpeed),new h(`startEndTime`,e=>A(pe,e.startTime,e.endTime))),s.constants.add(`fadeInTime`,`float`,Q),s.constants.add(`fadeOutTime`,`float`,Z),s.constants.add(`incomingTransition`,`int`,0),s.constants.add(`outgoingTransition`,`int`,2),s.code.add(y`float fadeIn(float x) {
return smoothstep(0.0, fadeInTime, x);
}
float fadeOut(float x) {
return isinf(fadeOutTime) ? 1.0 : smoothstep(fadeOutTime, 0.0, x);
}
void updateAlphaIf(inout float alpha, bool condition, float newAlpha) {
alpha = condition ? min(alpha, newAlpha) : alpha;
}
vec4 animate(vec4 color) {
float startTime = startEndTime[0];
float endTime = startEndTime[1];
float totalTime = vLastTime - vFirstTime;
float actualFadeOutTime = min(fadeOutTime * speed, trailLength);
float longStreamlineThreshold = (fadeInTime + 1.0) * speed + actualFadeOutTime;
bool longStreamline = totalTime > longStreamlineThreshold;
float totalTimeWithFadeOut = longStreamline && actualFadeOutTime != trailLength ? totalTime : totalTime + actualFadeOutTime;
float fadeOutStartTime = longStreamline ? totalTime - actualFadeOutTime : totalTime;
float originTime =  -vFirstTime;
float actualEndTime = int(vTransitionType) == outgoingTransition ? min(endTime, startTime + vLastTime / speed) : endTime;
vec4 animatedColor = color;
if (speed == 0.0) {
float alpha = getTrailOpacity((totalTimeWithFadeOut - (vTimeStamp - vFirstTime)) / trailLength);
updateAlphaIf(alpha, !isinf(actualEndTime), fadeOut(timeElapsed - actualEndTime));
updateAlphaIf(alpha, true, fadeIn(timeElapsed - startTime));
animatedColor.a *= alpha;
return animatedColor;
}
float relativeStartTime = mod(startTime, totalTimeWithFadeOut);
float shiftedTimeElapsed = timeElapsed - relativeStartTime + originTime;
float headRelativeToFirst = mod(shiftedTimeElapsed * speed, totalTimeWithFadeOut);
float vRelativeToHead = headRelativeToFirst - originTime - vTimeStamp;
float vAbsoluteTime = timeElapsed - vRelativeToHead / speed;
if (startTime > timeElapsed) {
return vec4(0.0);
}
float alpha = getTrailOpacity(vRelativeToHead / trailLength);
updateAlphaIf(alpha, true, fadeIn(timeElapsed - startTime));
updateAlphaIf(alpha, !isinf(actualEndTime), fadeOut(timeElapsed - actualEndTime));
updateAlphaIf(alpha, int(vTransitionType) != incomingTransition, step(startTime, vAbsoluteTime));
updateAlphaIf(alpha, headRelativeToFirst > fadeOutStartTime, fadeOut((headRelativeToFirst - fadeOutStartTime) / speed));
alpha *= fadeIn(vTimeStamp - vFirstTime);
animatedColor.a *= alpha;
return animatedColor;
}`)}function fe(e){switch(e){case 2:return`return x >= 0.0 && x <= 1.0 ? 1.0 : 0.0;`;case 3:return`float cutOff = exp(-decayRate);
        return (exp(-decayRate * x) - cutOff) / (1.0 - cutOff);`;default:return`return 1.0;`}}var pe=j(),me=1;function $(a){let m=new N,{attributes:h,varyings:v,vertex:b,fragment:x}=m,{applyMarkerOffset:S,draped:C,output:w,capType:T,stippleEnabled:E,falloffEnabled:D,roundJoins:O,wireframe:A,innerColorEnabled:j,hasAnimation:M,hasScreenSizePerspective:P,worldSizedImagePattern:F}=a;b.inputs.add(`position`,()=>`position`),x.include(p),m.include(f,a),m.include(oe,a),m.include(r,a),m.include(de,a);let I=S&&!C;I&&(b.uniforms.add(new g(`markerScale`,e=>e.markerScale)),m.include(ne,{space:2,hasScreenSizePerspective:P})),te(b,a),b.uniforms.add(new i(`inverseProjectionMatrix`,e=>e.camera.inverseProjectionMatrix),new n(`nearFar`,e=>e.camera.nearFar),new g(`miterLimit`,e=>e.join===`miter`?e.miterLimit:0),new re(`viewport`,e=>e.camera.fullViewport)),b.constants.add(`LARGE_HALF_FLOAT`,`float`,65500),b.constants.add(`EPS`,`float`,.001),b.constants.add(`NUM_JOIN_SUBDIVISIONS`,`float`,a.numJoinSubdivisions),h.add(`position`,`vec3`),h.add(`previousDelta`,`vec4`),h.add(`nextDelta`,`vec4`),h.add(`lineParameters`,`vec2`),h.add(`u0`,`float`),v.add(`vColor`,`vec4`),v.add(`vpos`,`vec3`,{invariant:!0}),v.add(`vLineDistance`,`float`),v.add(`vLineWidth`,`float`),E||(v.add(`vIsInsideJoin`,`int`),v.add(`vStretchFactor`,`float`),v.add(`vJoinCenterLineSDFs`,`vec2`),v.add(`vSubdivisionFactor`,`float`));let L=E;L&&v.add(`vLineSizeInv`,`float`);let R=T===2,z=E&&R,B=D||z;B&&v.add(`vLineDistanceNorm`,`float`),R&&(v.add(`vSegmentSDF`,`float`),v.add(`vReverseSegmentSDF`,`float`)),b.code.add(y`vec3 perpendicular(vec3 v) {
return vec3(v.y, -v.x, 0.0);
}
float interp(float ncp, vec4 a, vec4 b) {
return (-ncp - a.z) / (b.z - a.z);
}
vec3 rotateZ(vec3 v, float a) {
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, -s, s, c);
return vec3(m * v.xy, v.z);
}`),b.code.add(y`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
posNdc.z /= posNdc.w;
return posNdc;
}`),b.code.add(y`void clip(
inout vec4 pos,
inout vec4 prev,
inout vec4 next,
bool isStartVertex
) {
float vnp = nearFar[0] * 0.99;
if (pos.z > -nearFar[0]) {
if (!isStartVertex) {
if (prev.z < -nearFar[0]) {
pos = mix(prev, pos, interp(vnp, prev, pos));
next = pos;
} else {
pos = vec4(0.0, 0.0, 0.0, 1.0);
}
} else {
if (next.z < -nearFar[0]) {
pos = mix(pos, next, interp(vnp, pos, next));
prev = pos;
} else {
pos = vec4(0.0, 0.0, 0.0, 1.0);
}
}
} else {
if (prev.z > -nearFar[0]) {
prev = mix(pos, prev, interp(vnp, pos, prev));
}
if (next.z > -nearFar[0]) {
next = mix(next, pos, interp(vnp, next, pos));
}
}
}`),c(b),b.constants.add(`aaWidth`,`float`,+!E).main.add(y`
    // unpack values from vertex type
    bool isStartVertex = abs(abs(lineParameters.y) - 3.0) == 1.0;
    vec3 prevPosition = position + previousDelta.xyz * previousDelta.w;
    vec3 nextPosition = position + nextDelta.xyz * nextDelta.w;

    float coverage = 1.0;

    // Check for special value of lineParameters.y which is used by the Renderer when graphics are removed before the
    // VBO is recompacted. If this is the case, then we just project outside of clip space.
    if (lineParameters.y == 0.0) {
      gl_Position = ${k};
    }
    else {
      vec4 pos  = view * vec4(position, 1.0);
      vec4 prev = view * vec4(prevPosition, 1.0);
      vec4 next = view * vec4(nextPosition, 1.0);

      bool isJoin = abs(lineParameters.y) < 3.0;
  `),I&&b.main.add(y`vec4 other = isStartVertex ? next : prev;
bool markersHidden = areWorldMarkersHidden(pos.xyz, other.xyz);
if (!isJoin && !markersHidden) {
pos.xyz += normalize(other.xyz - pos.xyz) * getWorldMarkerSize(pos.xyz) * 0.5;
}`),m.include(d),b.main.add(y`
      clip(pos, prev, next, isStartVertex);

      vec3 clippedPos = pos.xyz;
      vec3 clippedCenter = mix(pos.xyz, isStartVertex ? next.xyz : prev.xyz, 0.5);

      pos = projectAndScale(pos);
      next = projectAndScale(next);
      prev = projectAndScale(prev);

      vec3 left = (pos.xyz - prev.xyz);
      vec3 right = (next.xyz - pos.xyz);

      float leftLen = length(left);
      float rightLen = length(right);

      float lineSize = getSize(${_(P,`clippedPos`)});
      ${_(E&&P,`float patternLineSize = getSize(clippedCenter);`)}
      ${_(E&&!P,`float patternLineSize = lineSize;`)}

      ${_(F,y`
          lineSize += aaWidth;
          float lineWidth = lineSize * pixelRatio * worldToScreenRatio;
          if (lineWidth < 1.0) {
            coverage = lineWidth;
            lineWidth = 1.0;
          }
        `,y`
          if (lineSize < 1.0) {
            coverage = lineSize; // convert sub-pixel coverage to alpha
            lineSize = 1.0;
          }

          lineSize += aaWidth;
          float lineWidth = lineSize * pixelRatio;
        `)}

      vLineWidth = noPerspectiveWrite(lineWidth, pos.w);
      ${L?y`vLineSizeInv = noPerspectiveWrite(1.0 / lineSize, pos.w);`:``}
  `),(E||R)&&b.main.add(y`
      float isEndVertex = float(!isStartVertex);
      vec3 segmentOrigin = mix(pos.xyz, prev.xyz, isEndVertex);
      vec3 segment = mix(right, left, isEndVertex);
      ${R?y`vec3 segmentEnd = mix(next.xyz, pos.xyz, isEndVertex);`:``}
    `),b.main.add(y`left = (leftLen > EPS) ? left/leftLen : vec3(0.0, 0.0, 0.0);
right = (rightLen > EPS) ? right/rightLen : vec3(0.0, 0.0, 0.0);
vec3 segmentDirection = isStartVertex ? right : left;
vec3 capDisplacementDir = vec3(0.0, 0.0, 0.0);
vec3 joinDisplacementDir = vec3(0.0, 0.0, 0.0);
float displacementLen = lineWidth;
float miterDisplacementLen = lineWidth;
float innerDisplacementLen = lineWidth;`),E||b.main.add(y`vIsInsideJoin = 0;
vStretchFactor = 1.0;
vSubdivisionFactor = 0.0;
vJoinCenterLineSDFs = vec2(LARGE_HALF_FLOAT);`),b.main.add(y`float subdivisionFactor = 0.0;
bool isOutside = false;
if (isJoin) {
isOutside = (left.x * right.y - left.y * right.x) * lineParameters.y > 0.0;
vec3 joinDirection = normalize(left + right);
joinDisplacementDir = perpendicular(joinDirection);
if (leftLen > EPS && rightLen > EPS) {
float nDotSeg = dot(joinDisplacementDir, left);
displacementLen /= length(nDotSeg * left - joinDisplacementDir);
miterDisplacementLen = displacementLen;
innerDisplacementLen = min(displacementLen, min(leftLen, rightLen)/abs(nDotSeg));
if (!isOutside) {
displacementLen = innerDisplacementLen;
}
}
subdivisionFactor = lineParameters.x;`),E||b.main.add(y`if(subdivisionFactor > 0.0) {
vIsInsideJoin = 1;
}
vSubdivisionFactor = isOutside ? subdivisionFactor : 0.5;
if (miterDisplacementLen > miterLimit * lineWidth) {
vec2 leftScreenDir = left.xy;
vec2 rightScreenDir = right.xy;
float leftScreenLen = length(leftScreenDir);
float rightScreenLen = length(rightScreenDir);
if (leftScreenLen > EPS && rightScreenLen > EPS) {
leftScreenDir /= leftScreenLen;
rightScreenDir /= rightScreenLen;
float theta = acos(clamp(dot(leftScreenDir, rightScreenDir), -1.0, 1.0));
float subdividedTriangleHeight = (innerDisplacementLen + lineWidth) * cos(theta / (2.0 + 2.0 * NUM_JOIN_SUBDIVISIONS));
float bevelTriangleHeight = innerDisplacementLen + lineWidth * cos(theta * 0.5);
float triangleHeight = NUM_JOIN_SUBDIVISIONS > 0.0 ? subdividedTriangleHeight : bevelTriangleHeight;
vStretchFactor = noPerspectiveWrite(max(triangleHeight / (2.0 * lineWidth), 1.0), pos.w);
}
}`),b.main.add(y`if (isOutside && (displacementLen > miterLimit * lineWidth)) {`),O?b.main.add(y`
        vec3 startDir = leftLen < EPS ? right : left;
        startDir = perpendicular(startDir);

        vec3 endDir = rightLen < EPS ? left : right;
        endDir = perpendicular(endDir);

        float factor = ${E?y`min(1.0, subdivisionFactor * ((NUM_JOIN_SUBDIVISIONS + 1.0) / NUM_JOIN_SUBDIVISIONS))`:y`subdivisionFactor`};

        float rotationAngle = acos(clamp(dot(startDir.xy, endDir.xy), -1.0, 1.0));
        joinDisplacementDir = rotateZ(startDir, -sign(lineParameters.y) * factor * rotationAngle);
      `):b.main.add(y`
        vec3 startDir = perpendicular(leftLen < EPS ? right : left);
        vec3 endDir = perpendicular(rightLen < EPS ? left : right);

        ${_(E,y`joinDisplacementDir = (isStartVertex || subdivisionFactor > 0.0) ? endDir : startDir;`,y`joinDisplacementDir = mix(startDir, endDir, subdivisionFactor);`)}
  `);let V=T!==0;return b.main.add(y`
        displacementLen = lineWidth;
      }
    } else {
      // CAP handling ---------------------------------------------------
      joinDisplacementDir = isStartVertex ? right : left;
      joinDisplacementDir = perpendicular(joinDisplacementDir);

      ${V?y`capDisplacementDir = vec3((isStartVertex ? -right : left).xy, 0.0);`:``}
    }
  `),b.main.add(y`
    // Displacement (in pixels) caused by join/or cap
    vec2 dposXY = (joinDisplacementDir.xy * sign(lineParameters.y) + capDisplacementDir.xy) * displacementLen;

    /**
     * To prevent z-fighting between layers, we also adjust the z value.
     * We want to ensure that the orientation of the final triangles is the same, regardless of the line width.
     * To do so, the below formula projects the xy displacement onto the original segment direction
     * to find the z-offset necessary so the triangle orientation is independent of the width.
     */
    float dposZ = dot(dposXY, segmentDirection.xy) / dot(segmentDirection.xy, segmentDirection.xy) * segmentDirection.z;
    vec3 dpos = vec3(dposXY, dposZ);

    float lineDistNorm = noPerspectiveWrite(sign(lineParameters.y), pos.w);

    vLineDistance = lineWidth * lineDistNorm;
    ${B?y`vLineDistanceNorm = lineDistNorm;`:``}

    pos.xyz += dpos;
  `),E||b.main.add(y`if (isJoin) {
vec2 joinCenterToVertex = dposXY;
vec2 leftCenterlineDir = left.xy;
vec2 rightCenterlineDir = right.xy;
float leftCenterlineLen = length(leftCenterlineDir);
float rightCenterlineLen = length(rightCenterlineDir);
leftCenterlineDir = leftCenterlineLen > EPS ? leftCenterlineDir / leftCenterlineLen : vec2(1.0, 0.0);
rightCenterlineDir = rightCenterlineLen > EPS ? rightCenterlineDir / rightCenterlineLen : leftCenterlineDir;
vJoinCenterLineSDFs = noPerspectiveWrite(
vec2(
dot(vec2(rightCenterlineDir.y, -rightCenterlineDir.x), joinCenterToVertex),
dot(vec2(leftCenterlineDir.y, -leftCenterlineDir.x), joinCenterToVertex)
),
pos.w
);
}`),R&&b.main.add(y`vec2 segmentDir = normalize(segment.xy);
vSegmentSDF = noPerspectiveWrite((isJoin && isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentOrigin.xy, segmentDir)), pos.w);
vReverseSegmentSDF = noPerspectiveWrite((isJoin && !isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentEnd.xy, -segmentDir)), pos.w);`),E&&(C?b.uniforms.add(new o(`worldToScreenRatio`,e=>1/e.screenToPCSRatio)):b.main.add(y`vec3 segmentCenter = mix((nextPosition + position) * 0.5, (position + prevPosition) * 0.5, isEndVertex);
float worldToScreenRatio = computeWorldToScreenRatio(segmentCenter);`),b.main.add(y`float segmentLengthScreenDouble = length(segment.xy);
float segmentLengthScreen = segmentLengthScreenDouble * 0.5;
float discreteWorldToScreenRatio = discretizeWorldToScreenRatio(worldToScreenRatio);
float segmentLengthRender = length(mix(nextPosition - position, position - prevPosition, isEndVertex));
vStipplePatternStretch = worldToScreenRatio / discreteWorldToScreenRatio;`),C?b.main.add(y`float segmentLengthPseudoScreen = segmentLengthScreen / pixelRatio * discreteWorldToScreenRatio / worldToScreenRatio;
float startPseudoScreen = u0 * discreteWorldToScreenRatio - mix(0.0, segmentLengthPseudoScreen, isEndVertex);`):b.main.add(y`float startPseudoScreen = mix(u0, u0 - segmentLengthRender, isEndVertex) * discreteWorldToScreenRatio;
float segmentLengthPseudoScreen = segmentLengthRender * discreteWorldToScreenRatio;`),b.uniforms.add(new g(`stipplePatternPixelSize`,e=>X(e))),b.main.add(y`
      float patternLength = patternLineSize * stipplePatternPixelSize;

      ${_(F,y`
          float uu = mix(u0, u0 - segmentLengthRender, isEndVertex);
          vStippleDistanceLimits = vec2(uu, uu + segmentLengthRender);
          vStipplePatternStretch = 1.0;

          // The v-coordinate used in case of an image pattern.
          bool isLeft = sign(lineParameters.y) < 0.0;
          vStippleV = isLeft ? 0.0 : 1.0;
        `,y`
          // Compute the coordinates at both start and end of the line segment, because we need both to clamp to in the
          // fragment shader
          vStippleDistanceLimits = computeStippleDistanceLimits(startPseudoScreen, segmentLengthPseudoScreen, segmentLengthScreen, patternLength);
        `)}

      vStippleDistance = mix(vStippleDistanceLimits.x, vStippleDistanceLimits.y, isEndVertex);

      // Adjust the coordinate to the displaced position (the pattern is shortened/overextended on the in/outside of
      // joins)
      if (segmentLengthScreenDouble >= EPS) {
        // Project the actual vertex position onto the line segment. Note that the resulting factor is within [0..1]
        // at the original vertex positions, and slightly outside of that range at the displaced positions
        vec3 stippleDisplacement = pos.xyz - segmentOrigin;
        float stippleDisplacementFactor = dot(segment.xy, stippleDisplacement.xy) / (segmentLengthScreenDouble * segmentLengthScreenDouble);

        // Apply this offset to the actual vertex coordinate (can be screen or pseudo-screen space)
        vStippleDistance += (stippleDisplacementFactor - isEndVertex) * (vStippleDistanceLimits.y - vStippleDistanceLimits.x);
      }

      // Cancel out perspective correct interpolation because we want this length the really represent the screen
      // distance
      vStippleDistanceLimits = noPerspectiveWrite(vStippleDistanceLimits, pos.w);
      vStippleDistance = noPerspectiveWrite(vStippleDistance, pos.w);

      // Disable stipple distance limits on caps
      vStippleDistanceLimits = isJoin ?
                                 vStippleDistanceLimits :
                                 isStartVertex ?
                                  vec2(-1e34, vStippleDistanceLimits.y) :
                                  vec2(vStippleDistanceLimits.x, 1e34);
    `)),b.main.add(y`
      // Convert back into NDC
      pos.xy = (pos.xy / viewport.zw) * pos.w;
      pos.z = pos.z * pos.w;

      vColor = getColor();
      vColor.a = noPerspectiveWrite(vColor.a * coverage, pos.w);

      ${A&&!C?`pos.z -= EPS * pos.w;`:``}

      // transform final position to camera space for slicing
      vpos = (inverseProjectionMatrix * pos).xyz;
      gl_Position = pos;
      forwardObjectAndLayerIdColor();
    }`),m.fragment.include(ee,a),m.include(l,a),x.include(t),x.main.add(y`discardBySlice(vpos);`),m.include(u),x.include(s),x.main.add(y`
    float lineWidth = noPerspectiveRead(vLineWidth);
    float lineDistance = noPerspectiveRead(vLineDistance);
    ${_(B,y`float lineDistanceNorm = noPerspectiveRead(vLineDistanceNorm);`)}
  `),A?x.main.add(y`vec4 finalColor = vec4(1.0, 0.0, 1.0, 1.0);`):(R&&x.main.add(y`float sdf = noPerspectiveRead(min(vSegmentSDF, vReverseSegmentSDF));
vec2 fragmentPosition = vec2(min(sdf, 0.0), lineDistance);
float fragmentRadius = length(fragmentPosition);
float fragmentCapSDF = (fragmentRadius - lineWidth) * 0.5;
float capCoverage = clamp(0.5 - fragmentCapSDF, 0.0, 1.0);
if (capCoverage < alphaCutoff) {
discard;
}`),z?x.main.add(y`vec2 stipplePosition = vec2(
min(getStippleSDF() * 2.0 - 1.0, 0.0),
lineDistanceNorm
);
float stippleRadius = length(stipplePosition * lineWidth);
float stippleCapSDF = (stippleRadius - lineWidth) * 0.5;
float stippleCoverage = clamp(0.5 - stippleCapSDF, 0.0, 1.0);
float stippleAlpha = step(alphaCutoff, stippleCoverage);`):x.main.add(y`float stippleAlpha = getStippleAlpha(lineWidth);`),w!==11&&x.main.add(y`discardByStippleAlpha(stippleAlpha, alphaCutoff);`),m.include(u),x.uniforms.add(new e(`intrinsicColor`,e=>e.color)).main.add(y`vec4 color = intrinsicColor * vColor;
color.a = noPerspectiveRead(color.a);`),j&&x.uniforms.add(new e(`innerColor`,e=>e.innerColor??e.color),new g(`innerWidth`,(e,t)=>e.innerWidth*t.camera.pixelRatio)).main.add(y`float distToInner = abs(lineDistance) - innerWidth;
float innerAA = clamp(0.5 - distToInner, 0.0, 1.0);
float innerAlpha = innerColor.a + color.a * (1.0 - innerColor.a);
color = mix(color, vec4(innerColor.rgb, innerAlpha), innerAA);`),x.main.add(y`vec4 finalColor = blendStipple(color, stippleAlpha);`),D&&(x.uniforms.add(new g(`falloff`,e=>e.falloff)),x.main.add(y`finalColor.a *= pow(max(0.0, 1.0 - abs(lineDistanceNorm)), falloff);`)),E||x.main.add(y`float stretchFactor = vIsInsideJoin == 1 ? noPerspectiveRead(vStretchFactor) : 1.0;
float featherWidth = 2.0;
float featherStartDistance = max(lineWidth - featherWidth / stretchFactor, 0.0);
float straightFeatherStartDistance = max(lineWidth - featherWidth, 0.0);
float value = abs(lineDistance);
float feather = (value - featherStartDistance) / (lineWidth - featherStartDistance);
vec2 joinCenterSDFs = noPerspectiveRead(vJoinCenterLineSDFs);
float joinCenterDistance = abs(vSubdivisionFactor > 0.5 ? joinCenterSDFs.x : joinCenterSDFs.y);
float straightFeather = (joinCenterDistance - straightFeatherStartDistance) / (lineWidth - straightFeatherStartDistance);
feather = vIsInsideJoin == 1 ? max(feather, straightFeather) : feather;
finalColor.a *= 1.0 - clamp(feather, 0.0, 1.0);`),M&&x.main.add(y`
        finalColor = animate(finalColor);

        ${_(w!==11,y`
            if (finalColor.a <= alphaCutoff) {
              discard;
            }`)}
      `)),x.main.add(y`outputColorHighlightOLID(applySlice(finalColor, vpos), finalColor.rgb);`),m}var he=Object.freeze(Object.defineProperty({__proto__:null,build:$,ribbonlineNumRoundJoinSubdivisions:1},Symbol.toStringTag,{value:`Module`}));export{ce as a,Q as c,V as d,R as f,le as i,G as l,me as n,Z as o,B as p,he as r,ue as s,$ as t,U as u};