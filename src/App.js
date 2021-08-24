import { useRef } from "react";
import Editor from "./Editor";
/* eslint import/no-webpack-loader-syntax: off */
import initialValue from "!!raw-loader!./test.html";
import { EDITOR_TYPES } from "./constants";
import {
  uploadInlineImages,
  uploadBase64Images,
  loadExternalImage,
  loadInlineImage,
} from "./image/utils";
import { INLINE_IMG_ATTR, EXTERNAL_IMG_ATTR } from "./image/constants";
import { isLinkNode } from "./link/utils";

export const App = () => {
  const linkDialogRef = useRef();
  const enableImageBlobConversion = (img) => false;

  const handleLinkDialog = (editor) => {
    const isLinkedNode = isLinkNode(editor, editor.selection.getNode());
    if (isLinkedNode) {
      editor.execCommand("Unlink");
      return;
    }
    linkDialogRef.current.show();
  };

  const handlePaste = async (event, editor) => {
    const images = event.clipboardData.files;
    if (images.length === 0) {
      return;
    }
    event.preventDefault();
    try {
      await uploadInlineImages(editor, images);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUploadImage = async (event, editor) => {
    if (!event.target.files.length) return;
    const files = event.target.files;
    try {
      await uploadBase64Images(editor, files);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoadImage = (node, type) => {
    if (type === INLINE_IMG_ATTR) {
      loadInlineImage(node);
    } else if (type === EXTERNAL_IMG_ATTR) {
      loadExternalImage(node);
    }
  };

  return (
    <Editor
      initialValue={initialValue}
      type={EDITOR_TYPES.signature}
      linkDialogRef={linkDialogRef}
      options={{
        enableImageBlobConversion: enableImageBlobConversion,
        enableInsertImageButton: true,
        onShowLinkDialog: handleLinkDialog,
        onPaste: handlePaste,
        onUploadImage: handleUploadImage,
        onLoadImage: handleLoadImage,
      }}
    />
  );
};
