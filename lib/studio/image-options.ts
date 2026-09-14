/** AI 대표이미지 스타일·비율 옵션 (클라이언트/서버 공용) */

export const IMAGE_STYLES = {
  clay: {
    label: "클레이아트",
    desc: "찰흙으로 빚은 듯한 3D 스톱모션 느낌",
    prompt:
      "Charming claymation-style 3D illustration. Everything is sculpted from handmade plasticine clay with soft rounded shapes, subtle fingerprints and a matte, slightly imperfect surface. Stop-motion animation look, tilt-shift studio photography, soft diffused lighting, gentle shadows, shallow depth of field.",
  },
  isometric: {
    label: "3D 아이소메트릭",
    desc: "깔끔한 3D 도식 스타일",
    prompt: "Clean 3D isometric illustration, smooth matte materials, soft global illumination, minimal props, rendered like a modern tech product explainer.",
  },
  flat: {
    label: "플랫 일러스트",
    desc: "단순한 도형의 벡터 일러스트",
    prompt: "Flat vector illustration, simple geometric shapes, limited palette, generous whitespace, friendly corporate blog style.",
  },
} as const;
export type ImageStyle = keyof typeof IMAGE_STYLES;
export const IMAGE_STYLE_KEYS = Object.keys(IMAGE_STYLES) as [ImageStyle, ...ImageStyle[]];

export const IMAGE_ASPECTS = ["16:9", "1:1", "4:3"] as const;
export type ImageAspect = (typeof IMAGE_ASPECTS)[number];
