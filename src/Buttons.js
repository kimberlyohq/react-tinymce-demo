import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { EditorContext } from "./EditorContext";

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
    const nodeChangeHander = (e) => {
      setActived(
        e.parents.some((node) =>
          editor.formatter.matchNode(node, type, value ? { value: value } : {})
        )
      );
    };
    editor.on("NodeChange", nodeChangeHander);
    return () => {
      editor.off("NodeChange", nodeChangeHander);
    };
  }, []);

  return (
    <button
      {...rest}
      onMouseDown={(e) => {
        e.preventDefault();

        editor.focus();
        editor.formatter.toggle(type, value ? { value: value } : undefined);
        // editor.nodeChanged()
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
      Highlight color{" "}
    </MarkButton>
  );
}

export function LargeSizeButton() {
  return (
    <MarkButton type="fontsize" value="large">
      Large size
    </MarkButton>
  );
}

export function SmallSizeButton() {
  return (
    <MarkButton type="fontsize" value="x-small">
      Small size
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
        editor.formatter.toggle("removeformat");
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
    const nodeChangeHander = (e) => {
      setActived(getActived(e));
    };

    editor.on("NodeChange", nodeChangeHander);
    return () => {
      editor.off("NodeChange", nodeChangeHander);
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

export const InsertImageButton = () => {
  const editor = useContext(EditorContext);
  const inputRef = useRef();
  const handleUpload = async (e) => {
    if (!e.target.files.length) return;

    editor.execCommand(
      "mceInsertContent",
      false,
      `<img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"></img>`
    );
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
