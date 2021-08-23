export const removeLink = (editor) => {
  editor.execCommand("Unlink");
};

export const openLink = (editor) => {
  const linkNode = getLinkNode(editor);
  const url = linkNode.getAttribute("href");
  window.open(url, "_blank");
};

export const getLinkNode = (editor) => {
  return editor.dom
    .getParents(editor.selection.getNode())
    .find((node) => node.nodeName === "A");
};

export const isLinkNode = (editor, link) => {
  return editor.dom.is(link, "a") && editor.getBody().contains(link);
};
