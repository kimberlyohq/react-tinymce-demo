import "./App.css";
import { useRef, useEffect, useState } from "react";
import LinkDialog from "./LinkDialog";
import tinymce from "tinymce/tinymce";
import { EditorContext } from "./EditorContext";
import "tinymce/themes/silver";
// Toolbar icons
import "tinymce/icons/default";
// // Editor styles
import "tinymce/skins/ui/oxide/skin.min.css";
import {
  BoldButton,
  ItalicButton,
  UnderlineButton,
  StrikethroughButton,
  RedColorButton,
  BlueColorButton,
  HighlightButton,
  SmallSizeButton,
  NormalSizeButton,
  LargeSizeButton,
  HugeSizeButton,
  RemoveFormatButton,
  BulletListButton,
  OrderListButton,
  IndentMoreButton,
  IndentLessButton,
  InsertLinkButton,
  InsertImageButton,
} from "./Buttons";
import { useLazyLoad } from "./ImageUpload/useLazyLoad";
// importing the plugin js.
// import 'tinymce/plugins/advlist';
// import 'tinymce/plugins/autolink';
// import 'tinymce/plugins/link';
// import "tinymce/plugins/paste";
// import 'tinymce/plugins/image';
import "tinymce/plugins/lists";
// import "tinymce/plugins/autoresize";
// import 'tinymce/plugins/charmap';
// import 'tinymce/plugins/hr';
// import 'tinymce/plugins/anchor';
// import 'tinymce/plugins/spellchecker';
// import 'tinymce/plugins/searchreplace';
// import 'tinymce/plugins/wordcount';
// import 'tinymce/plugins/code';
// import 'tinymce/plugins/fullscreen';
// import 'tinymce/plugins/insertdatetime';
// import 'tinymce/plugins/media';
// import 'tinymce/plugins/nonbreaking';
// import 'tinymce/plugins/table';
// import 'tinymce/plugins/template';
// import 'tinymce/plugins/help';

/* eslint import/no-webpack-loader-syntax: off */
// import contentCss from '!!raw-loader!tinymce/skins/content/default/content.min.css';
// import contentUiCss from '!!raw-loader!tinymce/skins/ui/oxide/content.min.css';
import "./plugins/spellchecker";
import "./plugins/paste";
import contentStyle from "!!raw-loader!./contentStyle.css";

function App({
  disabled = false,
  autoFocus = true,
  onChange,
  defaultValue = "",
}) {
  const rootRef = useRef();
  const [editor, setEditor] = useState(null);
  const linkDialogRef = useRef();
  useLazyLoad(editor, {});

  useEffect(() => {
    tinymce
      .init({
        readonly: disabled,
        target: rootRef.current,
        plugins: "lists spellchecker_onmail paste_onmail",
        init_instance_callback: (editor) => {
          console.log("init instance callback");
          editor.setContent(defaultValue);

          editor.undoManager.clear();
          editor.undoManager.add();
          editor.setDirty(false);
          editor.setMode(disabled ? "readonly" : "design");
          autoFocus && editor.focus();

          setEditor(editor);
        },
        setup: (editor) => {
          console.log("setup");
          editor.ui.registry.addButton("linkedit", {
            text: "edit link",
            onAction: () => {
              const linkNode = editor.dom
                .getParents(editor.selection.getNode())
                .find((node) => node.nodeName === "A");
              const linkContent = linkNode.text;
              const linkHref = linkNode.getAttribute("href");
              linkDialogRef.current.show(linkContent, linkHref);
            },
          });
          editor.ui.registry.addButton("linkopen", {
            text: "open link",
            onAction: () => {},
          });
          editor.ui.registry.addButton("linkremove", {
            text: "remove link",
            onAction: () => {},
          });

          var isLinkNode = function (link) {
            return editor.dom.is(link, "a") && editor.getBody().contains(link);
          };

          editor.ui.registry.addContextToolbar("table", {
            predicate: isLinkNode,
            items: "linkedit | linkopen | linkremove",
            scope: "node",
            position: "node",
          });

          // Keyboard shortcuts
          editor.addShortcut("meta+shift+X", "Strikethrough", function () {
            editor.execCommand("Strikethrough");
          });

          editor.addShortcut("meta+k", "Insert link", function () {
            linkDialogRef.current.show();
          });

          editor.addShortcut("meta+shift+7", "Numbered List", function () {
            const selection = editor.dom.getParents(editor.selection.getNode());
            const isNumberedList = selection.some((node) => node === "ol");
            if (isNumberedList) {
              editor.execCommand("RemoveList");
            } else {
              editor.execCommand("InsertOrderedList");
            }
          });

          editor.addShortcut("meta+shift+8", "Bulleted List", function () {
            const selection = editor.dom.getParents(editor.selection.getNode());
            const isNumberedList = selection.some((node) => node === "ul");
            if (isNumberedList) {
              editor.execCommand("RemoveList");
            } else {
              editor.execCommand("InsertUnorderedList");
            }
          });

          editor.addShortcut("meta+220", "Remove format", function () {
            editor.execCommand("RemoveFormat");
          });

          const FONT_SIZES = ["10px", "13px", "18px", "32px"];
          const FONT_SIZE_VALUE = {
            "10px": "x-small",
            "13px": "small",
            "18px": "large",
            "32px": "xx-large",
          };

          editor.addShortcut(
            "meta+shift+187",
            "Increase Font Size",
            function () {
              const node = editor.selection.getNode();
              const currentFontSize = editor.dom.getStyle(
                node,
                "font-size",
                true
              );

              if (currentFontSize === "32px") {
                return;
              }

              const currFontSizeIndex = FONT_SIZES.indexOf(
                currentFontSize ?? "13px"
              );

              const newFontSize = FONT_SIZES[currFontSizeIndex + 1];

              editor.execCommand(
                "FontSize",
                false,
                FONT_SIZE_VALUE[newFontSize]
              );
            }
          );

          editor.addShortcut(
            "meta+shift+189",
            "Decrease Font Size",
            function () {
              const node = editor.selection.getNode();
              const currentFontSize = editor.dom.getStyle(
                node,
                "font-size",
                true
              );

              if (currentFontSize === "10px") {
                return;
              }

              const currFontSizeIndex = FONT_SIZES.indexOf(
                currentFontSize ?? "13px"
              );

              const newFontSize = FONT_SIZES[currFontSizeIndex - 1];

              editor.execCommand(
                "FontSize",
                false,
                FONT_SIZE_VALUE[newFontSize]
              );
            }
          );

          editor.addShortcut("meta+221", "Indent More", function () {
            editor.execCommand("Indent");
          });

          editor.addShortcut("meta+219", "Indent Less", function () {
            editor.execCommand("Outdent");
          });
        },

        branding: false,
        contextmenu: false,
        custom_ui_selector: ".custom-inline-strong",
        elementpath: false,
        // TODO: temp fix
        height: 5000,

        icons: "",
        preview_styles: false,
        menubar: false,
        toolbar: "spellchecker",
        placeholder: "this is a placeholder",
        resize: true,
        skin: false,
        statusbar: false,

        content_css: false,
        content_style: contentStyle,

        visual: false,

        convert_fonts_to_spans: true,
        font_size_style_values: "x-small,small,large,xx-large",
        element_format: "html",
        forced_root_block: "div",
        //if set false the space key will not work
        remove_trailing_brs: true,
        //the formats will change the format recognize
        formats: {
          //  bold: {inline: "b"},
          // italic: { inline: 'i' },
          // underline: { inline: 'u'},
          // strikethrough: { inline: 'strike' },
        },

        browser_spellcheck: true,

        block_unsupported_drop: false,
        images_reuse_filename: true,
        autoresize_bottom_margin: 0,
        object_resizing: "img",
      })
      .then((editors) => {
        console.log("init complete");
      });
  }, []);

  useEffect(() => {
    return () => {
      editor && editor.destroy();
    };
  }, [editor]);

  return (
    <EditorContext.Provider value={editor}>
      {!!editor && (
        <>
          <div className="custom-inline-strong">
            <BoldButton />
            <ItalicButton />
            <UnderlineButton />
            <StrikethroughButton />
            <RedColorButton />
            <BlueColorButton />
            <HighlightButton />
            <SmallSizeButton />
            <NormalSizeButton />
            <LargeSizeButton />
            <HugeSizeButton />
            <RemoveFormatButton />
            <BulletListButton />
            <OrderListButton />
            <IndentMoreButton />
            <IndentLessButton />
            <InsertLinkButton onClick={() => linkDialogRef.current.show()} />
            <InsertImageButton />
          </div>
        </>
      )}
      <div ref={rootRef} />
      {!!editor && <LinkDialog ref={linkDialogRef} />}
    </EditorContext.Provider>
  );
}

export default App;
