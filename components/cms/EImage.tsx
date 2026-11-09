"use client";

import { useEffect } from "react";
import NextImage, { type ImageProps } from "next/image";
import { useCms } from "@/components/cms/CmsProvider";

// next/image whose source can be replaced from Admin → Page content (swapped in by
// scripts/cms-codemod.mjs). In the admin preview it reports itself so it can be listed.
export default function Image(props: ImageProps) {
  const { images, preview, register } = useCms();
  const original = typeof props.src === "string" ? props.src : null;

  useEffect(() => (preview && original ? register("image", original, original) : undefined), [preview, original, register]);

  const src = (original && images[original]) || props.src;
  return <NextImage {...props} src={src} {...(preview && original ? { "data-cms-img": original } : {})} />;
}
