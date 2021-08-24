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

export const HOTKEYS = {
  "meta+shift+X": () => {},
  "meta+k": () => {},
  "meta+shift+7": () => {},
  "meta+shift+8": () => {},
  "meta+\\": () => {},
  "meta+shift+187": () => {},
  "meta+shift+189": () => {},
  "meta+221": () => {},
  "meta+219": () => {},
};
