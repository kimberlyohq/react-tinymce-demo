import React, {
  useContext,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react";
import { EditorContext } from "./EditorContext";

function LinkDialog({}, ref) {
  const editor = useContext(EditorContext);
  const [state, setState] = useState({
    open: false,
    defaultContent: "",
    defaultLink: "",
  });
  const { open, defaultContent, defaultLink } = state;
  const textRef = useRef();
  const hrefRef = useRef();
  const handleSure = () => {
    editor.focus();
    if (editor.selection.isCollapsed()) {
      const text = textRef.current.value;
      const href = hrefRef.current.value;
      editor.execCommand(
        "mceInsertContent",
        false,
        `<a href="${href}">${text}</a>`
      );
    } else {
      editor.execCommand("mceInsertLink", false, hrefRef.current.value);
    }

    setState((state) => ({ ...state, open: false }));
  };

  useEffect(() => {
    const handleFocusIn = () => {
      setState((state) => ({ ...state, open: false }));
    };
    editor.on("focusin", handleFocusIn);
    return () => {
      editor.off("focusin", handleFocusIn);
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: (defaultContent, defaultLink) => {
        setState({ open: true, defaultContent, defaultLink });
      },
    }),
    []
  );

  if (!open) return null;

  return (
    <div
      style={{
        position: "absolute",
        border: 1,
        left: 0,
        bottom: 0,
        width: 300,
        height: 200,
      }}
    >
      <input
        type="text"
        placeholder="text"
        defaultValue={defaultContent}
        ref={textRef}
        autoFocus={!defaultContent}
      />
      <input
        type="text"
        placeholder="href"
        defaultValue={defaultLink}
        ref={hrefRef}
        autoFocus={!!defaultLink}
      />
      <button
        onClick={() => {
          setState((state) => ({ ...state, open: false }));
          editor.focus();
        }}
      >
        cancel
      </button>

      <button onClick={handleSure}>sure</button>
    </div>
  );
}

export default forwardRef(LinkDialog);
