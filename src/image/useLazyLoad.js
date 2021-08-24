import { useEffect } from "react";
import "intersection-observer";

import { INLINE_IMG_ATTR, EXTERNAL_IMG_ATTR } from "./constants";

const defaultConfig = { root: null, threshold: 0 };

export const useLazyLoad = (editor, onLoadImage, config = defaultConfig) => {
  const setExternalImgAttribs = (node, src) => {
    node.removeAttribute("data-src");
    editor.dom.setAttribs(node, { src, "data-mce-src": src });
  };

  const setInlineImgAttribs = (node, blob) => {
    const cid = node.getAttribute(INLINE_IMG_ATTR);
    const src = URL.createObjectURL(blob);
    editor.dom.setAttribs(node, { src, "data-mce-src": src, cid });
    node.removeAttribute("data-cid");
  };

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

          // external images
          if (node.getAttribute(EXTERNAL_IMG_ATTR)) {
            onLoadImage(node, EXTERNAL_IMG_ATTR).then((src) => {
              setExternalImgAttribs(node, src);
            });
            observer.unobserve(node);
          } else {
            // inline images
            onLoadImage(node, INLINE_IMG_ATTR).then((blob) => {
              setInlineImgAttribs(node, blob);
            });

            observer.unobserve(node);
          }
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
