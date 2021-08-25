import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { EditorContext } from "./EditorContext";
import { FONT_SIZES } from "./constants";

export function MarkButton({ type, children, value, onMouseDown, ...rest }) {
  const editor = useContext(EditorContext);
  const [actived, setActived] = useState(() => {
    return editor.dom
      .getParents(editor.selection.getNode())
      .some((node) =>
        editor.formatter.matchNode(node, type, value ? { value: value } : {})
      );
  });

  useEffect(() => {
    const nodeChangeHandler = (e) => {
      setActived(
        e.parents.some((node) => {
          const isMatchNode = editor.formatter.matchNode(
            node,
            type,
            value ? { value: value } : {}
          );

          if (type !== "underline") {
            return isMatchNode;
          }

          // check text-decoration
          const isUnderlined = editor.dom
            .getStyle(node, "text-decoration", true)
            .includes("underline");

          return isUnderlined || isMatchNode;
        })
      );
    };
    editor.on("NodeChange", nodeChangeHandler);
    return () => {
      editor.off("NodeChange", nodeChangeHandler);
    };
  }, []);

  return (
    <button
      {...rest}
      onMouseDown={(e) => {
        e.preventDefault();

        editor.focus();
        editor.execCommand(type, false, value);
      }}
      style={{ color: actived ? "blue" : "black" }}
    >
      {children}
    </button>
  );
}

export function BoldButton() {
  return <MarkButton type="bold">Bold</MarkButton>;
}

export function ItalicButton() {
  return <MarkButton type="italic">Italic </MarkButton>;
}

export function UnderlineButton() {
  return <MarkButton type="underline">Underline </MarkButton>;
}

export function StrikethroughButton() {
  return <MarkButton type="strikethrough">Strikethrough </MarkButton>;
}
export function RedColorButton() {
  return (
    <MarkButton type="forecolor" value="red">
      Red color
    </MarkButton>
  );
}

export function BlueColorButton() {
  return (
    <MarkButton type="forecolor" value="blue">
      Blue color
    </MarkButton>
  );
}

export function HighlightButton() {
  return (
    <MarkButton type="hilitecolor" value="#ffd41a">
      Highlight color
    </MarkButton>
  );
}

export function RemoveFormatButton({ ...rest }) {
  const editor = useContext(EditorContext);

  return (
    <button
      {...rest}
      onMouseDown={(e) => {
        e.preventDefault();
        editor.focus();
        if (editor.selection.isCollapsed()) {
          return;
        }
        editor.execCommand("RemoveFormat");
      }}
    >
      Remove format
    </button>
  );
}
const listTypeToNodeName = {
  bullist: "UL",
  numlist: "OL",
};
const listTypeToCommand = {
  bullist: "InsertUnorderedList",
  numlist: "InsertOrderedList",
};
function ListButton({ type, children }) {
  const editor = useContext(EditorContext);
  const getActived = useCallback((e) => {
    return e.parents.some((node) => node.nodeName === listTypeToNodeName[type]);
  }, []);
  const [actived, setActived] = useState(
    getActived({ parents: editor.dom.getParents(editor.selection.getNode()) })
  );

  useEffect(() => {
    const nodeChangeHandler = (e) => {
      setActived(getActived(e));
    };

    editor.on("NodeChange", nodeChangeHandler);
    return () => {
      editor.off("NodeChange", nodeChangeHandler);
    };
  }, []);

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        editor.focus();
        editor.execCommand("RemoveList");

        !actived && editor.execCommand(listTypeToCommand[type]);
      }}
      style={{ color: actived ? "blue" : "black" }}
    >
      {children}
    </button>
  );
}

export const BulletListButton = () => {
  return <ListButton type="bullist">Bullet list</ListButton>;
};

export const OrderListButton = () => {
  return <ListButton type="numlist">Order list</ListButton>;
};

export const IndentMoreButton = () => {
  const editor = useContext(EditorContext);

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        editor.focus();
        editor.execCommand("indent");
      }}
    >
      Indent more
    </button>
  );
};

export const IndentLessButton = () => {
  const editor = useContext(EditorContext);

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        editor.focus();
        editor.execCommand("outdent");
      }}
    >
      Indent less
    </button>
  );
};

const DEFAULT_FONT_SIZE = "13px";

export const SizeButton = () => {
  const editor = useContext(EditorContext);
  const [size, setSize] = useState(DEFAULT_FONT_SIZE);
  const handleChange = (event) => {
    const selectedSize = event.target.value;
    editor.execCommand("FontSize", false, selectedSize);
  };

  useEffect(() => {
    const nodeChangeHandler = (e) => {
      const node = editor.selection.getNode();
      const currentFontSize = editor.dom.getStyle(node, "font-size", true);
      setSize(currentFontSize ?? DEFAULT_FONT_SIZE);
    };

    editor.on("NodeChange", nodeChangeHandler);
    return () => {
      editor.off("NodeChange", nodeChangeHandler);
    };
  }, []);

  return (
    <select value={size} onChange={handleChange}>
      {FONT_SIZES.map((size, index) => (
        <option key={index} value={size.value}>
          {size.label}
        </option>
      ))}
    </select>
  );
};

export const InsertImageButton = ({ onUpload }) => {
  const editor = useContext(EditorContext);
  const inputRef = useRef();
  const handleUpload = async (e) => {
    onUpload(e, editor);
    inputRef.current.value = "";
  };
  return (
    <>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          inputRef.current.click();
        }}
      >
        Insert image
      </button>
      <input
        type="file"
        hidden
        ref={inputRef}
        onChange={handleUpload}
        accept="image/*"
        multiple
      />
    </>
  );
};

export const InsertLinkButton = ({ onClick }) => {
  return (
    <>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        Insert link
      </button>
    </>
  );
};
