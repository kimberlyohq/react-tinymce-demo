import "./App.css";
import { useRef, useEffect, useState } from "react";
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver";
// Toolbar icons
import "tinymce/icons/default";
// Editor styles
import "tinymce/skins/ui/oxide/skin.min.css";
import {
  BoldButton,
  ItalicButton,
  UnderlineButton,
  StrikethroughButton,
  RedColorButton,
  BlueColorButton,
  HighlightButton,
  RemoveFormatButton,
  BulletListButton,
  OrderListButton,
  IndentMoreButton,
  IndentLessButton,
  InsertLinkButton,
  InsertImageButton,
  SizeButton,
} from "./Buttons";
import { useLazyLoad } from "./image/useLazyLoad";
import { removeLink, openLink, getLinkNode } from "./link/utils";
import LinkDialog from "./LinkDialog";
import { EditorContext } from "./EditorContext";
import { HOTKEYS_COMMAND, HOTKEYS_PATTERN } from "./constants";
// Plugins
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
import contentStyle from "!!raw-loader!./contentStyle.css";

export default function Editor({
  linkDialogRef,
  disabled = false,
  initialValue = "",
  defaultValue = "",
  type,
  onChange,
  onKeyDown,
  options: {
    autoFocus = true,
    enableImageBlobConversion,
    enableInsertImageButton,
    onShowLinkDialog,
    onPaste,
    onUploadImage,
    onLoadImage,
  },
}) {
  const rootRef = useRef();
  const [editor, setEditor] = useState(null);
  useLazyLoad(editor, onLoadImage, {});
  useEffect(() => {
    tinymce
      .init({
        readonly: disabled,
        target: rootRef.current,
        plugins: "lists spellchecker_onmail",
        init_instance_callback: (editor) => {
          console.log("init instance callback");
          editor.setContent(initialValue);

          editor.undoManager.clear();
          editor.undoManager.add();
          editor.setDirty(false);
          editor.setMode(disabled ? "readonly" : "design");
          autoFocus && editor.focus();

          setEditor(editor);

          editor.on("paste", (event) => {
            onPaste(event, editor);
          });
        },
        setup: (editor) => {
          console.log("setup");

          editor.ui.registry.addButton("linkedit", {
            text: "edit link",
            onAction: () => {
              const linkNode = getLinkNode(editor);
              const linkContent = linkNode.text;
              const linkHref = linkNode.getAttribute("href");
              linkDialogRef.current.show(linkContent, linkHref);
            },
          });
          editor.ui.registry.addButton("linkopen", {
            text: "open link",
            onAction: () => {
              openLink(editor);
            },
          });
          editor.ui.registry.addButton("linkremove", {
            text: "remove link",
            onAction: () => {
              removeLink(editor);
            },
          });

          var isLinkNodePredicate = function (link) {
            return editor.dom.is(link, "a") && editor.getBody().contains(link);
          };

          editor.ui.registry.addContextToolbar("table", {
            predicate: isLinkNodePredicate,
            items: "linkedit | linkopen | linkremove",
            scope: "node",
            position: "node",
          });

          // Keyboard shortcuts
          editor.addShortcut(
            HOTKEYS_PATTERN["Strikethrough"],
            "Strikethrough",
            function () {
              HOTKEYS_COMMAND["Strikethrough"](editor);
            }
          );

          editor.addShortcut(
            HOTKEYS_PATTERN["NumberedList"],
            "Numbered List",
            function () {
              HOTKEYS_COMMAND["NumberedList"](editor);
            }
          );

          editor.addShortcut(
            HOTKEYS_PATTERN["BulletedList"],
            "Bulleted List",
            function () {
              HOTKEYS_COMMAND["BulletedList"](editor);
            }
          );

          // cmd + \
          editor.addShortcut(
            HOTKEYS_PATTERN["RemoveFormat"],
            "Remove Format",
            function () {
              HOTKEYS_COMMAND["RemoveFormat"](editor);
            }
          );

          // cmd + '+'
          editor.addShortcut(
            HOTKEYS_PATTERN["IncreaseFontSize"],
            "Increase Font Size",
            function () {
              HOTKEYS_COMMAND["IncreaseFontSize"](editor);
            }
          );

          // cmd + '-'
          editor.addShortcut(
            HOTKEYS_PATTERN["DecreaseFontSize"],
            "Decrease Font Size",
            function () {
              HOTKEYS_COMMAND["DecreaseFontSize"](editor);
            }
          );

          // cmd + ]
          editor.addShortcut(
            HOTKEYS_PATTERN["Indent"],
            "Indent More",
            function () {
              HOTKEYS_COMMAND["Indent"](editor);
            }
          );

          //cmd + [
          editor.addShortcut(
            HOTKEYS_PATTERN["Outdent"],
            "Indent Less",
            function () {
              HOTKEYS_COMMAND["Outdent"](editor);
            }
          );

          editor.on("keydown", (event) => {
            onKeyDown(event)(editor);
          });
        },

        relative_urls: false,
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

        convert_fonts_to_spans: false,
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
          removeformat: [
            {
              selector:
                "b,strong,em,italic,font,underline,strike,s,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins,small",
              remove: "all",
              split: true,
              block_expand: true,
              expand: false,
              deep: true,
            },
            {
              selector: "span",
              attributes: ["style", "class"],
              remove: "empty",
              split: true,
              expand: false,
              deep: true,
            },
            {
              selector: "a",
              remove: "all",
            },
            {
              selector: "*",
              attributes: ["style", "class"],
              split: false,
              expand: false,
              deep: true,
            },
          ],
        },

        browser_spellcheck: true,

        block_unsupported_drop: false,
        images_reuse_filename: true,
        object_resizing: "img",
        images_dataimg_filter: enableImageBlobConversion,
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
            <RemoveFormatButton />
            <BulletListButton />
            <OrderListButton />
            <IndentMoreButton />
            <IndentLessButton />
            <SizeButton />
            <InsertLinkButton onClick={() => onShowLinkDialog(editor)} />
            {enableInsertImageButton && (
              <InsertImageButton onUpload={onUploadImage} />
            )}
          </div>
        </>
      )}
      <div ref={rootRef} />
      {!!editor && <LinkDialog ref={linkDialogRef} />}
    </EditorContext.Provider>
  );
}
