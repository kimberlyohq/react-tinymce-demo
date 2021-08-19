import { useEffect } from "react";
import "intersection-observer";
import { fetchInlineImage } from "./utils";

export const useLazyLoad = (editor, { root = null, threshold = 0 }) => {
  useEffect(() => {
    if (editor) {
      const externalImages = Array.from(editor.dom.select("img[data-src]"));

      const inlineImages = Array.from(editor.dom.select("img[data-cid]"));

      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio <= 0.3) return;
            const node = entry.target;
            // already loaded
            if (!!node.getAttribute("src")) return;

            // external image
            if (node.getAttribute("data-src")) {
              const dataSrc = node.getAttribute("data-src");
              node.removeAttribute("data-src");
              node.setAttribute("src", dataSrc);
              node.setAttribute("data-mce-src", dataSrc);
              observer.unobserve(node);
            } else {
              // inline images
              fetchInlineImage(node, node.getAttribute("data-cid"));
              observer.unobserve(node);
            }
          });
        },
        { root: null, threshold: 1.0 }
      );

      // set up observer for each image
      [...externalImages, ...inlineImages].forEach((node) => {
        console.log("here");
        observer.observe(node);
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [editor]);
};
