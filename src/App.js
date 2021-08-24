import { useRef } from "react";
import Editor from "./Editor";
/* eslint import/no-webpack-loader-syntax: off */
import initialValue from "!!raw-loader!./test.html";
import { EDITOR_TYPES } from "./constants";
import { uploadInlineImages, uploadBase64Images } from "./image/utils";
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

  const handlePaste = (event, editor) => {
    const images = event.clipboardData.files;
    if (images.length === 0) {
      return;
    }
    event.preventDefault();
    uploadInlineImages(editor, images);
  };

  return (
    <Editor
      initialValue={initialValue}
      type={EDITOR_TYPES.signature}
      linkDialogRef={linkDialogRef}
      options={{
        enableImageBlobConversion: enableImageBlobConversion,
        enableInsertImageButton: true,
        onUploadImage: uploadBase64Images,
        onShowLinkDialog: handleLinkDialog,
        onPaste: handlePaste,
      }}
    />
  );
};
