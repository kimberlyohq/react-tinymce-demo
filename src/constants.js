export const EDITOR_TYPES = {
  compose: "compose",
  signature: "signature",
  calendarDescription: "calendarDescription",
};

export const FONT_SIZES = [
  { label: "Small", value: "10px" },
  { label: "Normal", value: "13px" },
  { label: "Large", value: "18px" },
  { label: "Huge", value: "32px" },
];

export const SIZES = FONT_SIZES.map((option) => option.value);

export const IS_MAC =
  typeof window != "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

export const HOTKEYS_PATTERN = {
  Strikethrough: IS_MAC ? "meta+shift+X" : "ctrl+shift+X",
  BulletedList: IS_MAC ? "meta+shift+8" : "ctrl+shift+8",
  NumberedList: IS_MAC ? "meta+shift+7" : "ctrl+shift+7",
  RemoveFormat: IS_MAC ? "meta+220" : "ctrl+220",
  IncreaseFontSize: IS_MAC ? "meta+shift+187" : "ctrl+shift+187",
  DecreaseFontSize: IS_MAC ? "meta+shift+189" : "ctrl+shift+189",
  Indent: IS_MAC ? "meta+221" : "ctrl+221",
  Outdent: IS_MAC ? "meta+219" : "ctrl+219",
};

export const HOTKEYS_COMMAND = {
  Strikethrough: (editor) => editor.execCommand("Strikethrough"),
  NumberedList: (editor) => {
    const selection = editor.dom.getParents(editor.selection.getNode());
    const isNumberedList = selection.some((node) => node === "ol");
    editor.execCommand("RemoveList");
    if (!isNumberedList) {
      editor.execCommand("InsertOrderedList");
    }
  },
  BulletedList: (editor) => {
    const selection = editor.dom.getParents(editor.selection.getNode());
    const isBulletedList = selection.some((node) => node === "ul");
    editor.execCommand("RemoveList");
    if (!isBulletedList) {
      editor.execCommand("InsertUnorderedList");
    }
  },
  RemoveFormat: (editor) => {
    if (editor.selection.isCollapsed()) {
      return;
    }
    editor.execCommand("RemoveFormat");
  },
  IncreaseFontSize: (editor) => {
    const node = editor.selection.getNode();
    const currentFontSize = editor.dom.getStyle(node, "font-size", true);

    if (currentFontSize === "32px") {
      return;
    }

    const currFontSizeIndex = SIZES.indexOf(currentFontSize ?? "13px");

    const newFontSize = SIZES[currFontSizeIndex + 1];

    editor.execCommand("FontSize", false, newFontSize);
  },
  DecreaseFontSize: (editor) => {
    const node = editor.selection.getNode();
    const currentFontSize = editor.dom.getStyle(node, "font-size", true);

    if (currentFontSize === "10px") {
      return;
    }

    const currFontSizeIndex = SIZES.indexOf(currentFontSize ?? "13px");

    const newFontSize = SIZES[currFontSizeIndex - 1];

    editor.execCommand("FontSize", false, newFontSize);
  },
  Indent: (editor) => {
    editor.execCommand("Indent");
  },
  Outdent: (editor) => {
    editor.execCommand("Outdent");
  },
};


