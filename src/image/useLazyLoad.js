import { useEffect } from "react";
import "intersection-observer";

import { INLINE_IMG_ATTR, EXTERNAL_IMG_ATTR } from "./constants";

const defaultConfig = { root: null, threshold: 0 };

export const useLazyLoad = (editor, onLoadImage, config = defaultConfig) => {
  useEffect(() => {
    if (editor) {
      const externalImages = Array.from(editor.dom.select("img[data-src]"));

      const inlineImages = Array.from(editor.dom.select("img[data-cid]"));

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio <= 0.3) return;

          const node = entry.target;
          // already loaded
          if (!!node.getAttribute("src")) return;

          new Promise((_, reject) => {
            // external images
            if (node.getAttribute("data-src")) {
              onLoadImage(node, EXTERNAL_IMG_ATTR).catch((err) => reject(err));
              observer.unobserve(node);
            } else {
              // inline images
              onLoadImage(node, INLINE_IMG_ATTR).catch((err) => reject(err));
              observer.unobserve(node);
            }
          }).catch((err) => console.log(err));
        });
      }, config);

      // set up observer for each image
      [...externalImages, ...inlineImages].forEach((node) => {
        observer.observe(node);
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [editor]);
};
