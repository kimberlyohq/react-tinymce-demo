import './App.css'
import { useRef, useEffect, useState } from 'react'
import LinkDialog from './LinkDialog'
import tinymce from 'tinymce/tinymce'
import { EditorContext } from './EditorContext'
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// // Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';
import { BoldButton, ItalicButton, UnderlineButton, StrikethroughButton, RedColorButton, BlueColorButton, HighlightButton, SmallSizeButton, LargeSizeButton, RemoveFormatButton, BulletListButton, OrderListButton, IndentMoreButton, IndentLessButton, InsertLinkButton } from './Buttons'
// importing the plugin js.
// import 'tinymce/plugins/advlist';
// import 'tinymce/plugins/autolink';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/autoresize'
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


function App({ disabled = false, autoFocus = true, onChange, defaultValue = '', }) {
  const rootRef = useRef()
  
  const [editor, setEdtitor] = useState(null)
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  useEffect(() => {

    function example_image_upload_handler (blobInfo, success, failure, progress) {
      var xhr, formData;
    
      xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open('POST', 'postAcceptor.php');
    
      xhr.upload.onprogress = function (e) {
        progress(e.loaded / e.total * 100);
      };
    
      xhr.onload = function() {
        var json;
    
        if (xhr.status === 403) {
          failure('HTTP Error: ' + xhr.status, { remove: true });
          return;
        }
    
        if (xhr.status < 200 || xhr.status >= 300) {
          failure('HTTP Error: ' + xhr.status);
          return;
        }
    
        json = JSON.parse(xhr.responseText);
    
        if (!json || typeof json.location != 'string') {
          failure('Invalid JSON: ' + xhr.responseText);
          return;
        }
    
        success(json.location);
      };
    
      xhr.onerror = function () {
        failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
      };
    
      formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
    
      xhr.send(formData);
    };

    tinymce.init({
      readonly: disabled,
      target: rootRef.current,
      plugins: 'lists autoresize',
      init_instance_callback: editor => {
        
       
        console.log('init instance callback')
        editor.setContent(defaultValue)
        editor.undoManager.clear()
        editor.undoManager.add()
        editor.setDirty(false)
        editor.setMode(disabled ? 'readonly' : 'design')
        autoFocus && editor.focus()
        setEdtitor(editor)
      },
      setup: editor => {
        console.log('setup')
        editor.ui.registry.addButton('linkedit', {
          text: 'edit link',
          
          onAction: () => {

          },
        });
        editor.ui.registry.addButton('linkopen', {
          text: 'open link',
          onAction: () => {
            
          },
        });
        editor.ui.registry.addButton('linkremove', {
          text: 'remove link',
          onAction: () => {
            
          },
        });

        var isLinkNode = function (link) {
          return editor.dom.is(link, 'a') && editor.getBody().contains(link);
        };

        editor.ui.registry.addContextToolbar('table', {
          predicate: isLinkNode,
          items: 'linkedit | linkopen | linkremove',
          scope: 'node',
          position: 'node'
        });
      },

      branding: false,
      contextmenu: false,
      custom_ui_selector: '.custom-inline-strong',
      elementpath: false,
      min_height: 300,
      
     
      icons: '',
      preview_styles: false,
      menubar: false,
      toolbar: false,
      placeholder: 'this is a placeholder',
      resize: true,
      skin: false,
      statusbar: false,
      

      
      content_css: false,
      content_style: `.mce-content-body { min-height: 286px !important; font: small/ 1.5  Arial,Helvetica,sans-serif } 
      .ephox-snooker-resizer-bar {
        background-color: #b4d7ff;
        opacity: 0;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .ephox-snooker-resizer-cols {
        cursor: col-resize;
      }
      .ephox-snooker-resizer-rows {
        cursor: row-resize;
      }
      .ephox-snooker-resizer-bar.ephox-snooker-resizer-bar-dragging {
        opacity: 1;
      }
      .mce-content-body img::-moz-selection {
        background: none;
      }
      .mce-content-body img::selection {
        background: none;
      }
      .mce-content-body img[data-mce-selected] {
  outline: 3px solid #b4d7ff;
}
      .mce-content-body div.mce-resizehandle {
        background-color: #4099ff;
        border-color: #4099ff;
        border-style: solid;
        border-width: 1px;
        box-sizing: border-box;
        height: 10px;
        position: absolute;
        width: 10px;
        z-index: 10000;
      }
      .mce-content-body div.mce-resizehandle:hover {
        background-color: #4099ff;
      }
      .mce-content-body div.mce-resizehandle:nth-of-type(1) {
        cursor: nwse-resize;
      }
      .mce-content-body div.mce-resizehandle:nth-of-type(2) {
        cursor: nesw-resize;
      }
      .mce-content-body div.mce-resizehandle:nth-of-type(3) {
        cursor: nwse-resize;
      }
      .mce-content-body div.mce-resizehandle:nth-of-type(4) {
        cursor: nesw-resize;
      }
      .mce-content-body .mce-resize-backdrop {
        z-index: 10000;
      }
      .mce-content-body .mce-clonedresizable {
        cursor: default;
        opacity: 0.5;
        outline: 1px dashed black;
        position: absolute;
        z-index: 10001;
      }
      .mce-content-body .mce-resize-helper {
        background: #555;
        background: rgba(0, 0, 0, 0.75);
        border: 1px;
        border-radius: 3px;
        color: white;
        display: none;
        font-family: sans-serif;
        font-size: 12px;
        line-height: 14px;
        margin: 5px 10px;
        padding: 5px;
        position: absolute;
        white-space: nowrap;
        z-index: 10002;
      }
      `,
      visual: false,


      convert_fonts_to_spans: false,
      element_format: 'html',
      forced_root_block: 'div',
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
      images_upload_handler: example_image_upload_handler,

      paste_data_images: true,
      paste_enable_default_filters: false,
      // paste_preprocess: (plugin, args) => {

      // }

      autoresize_bottom_margin: 0,
      object_resizing: 'img'
    

    }).then(editors => {
      console.log('init complete')
    
    })
    
  }, [])

  useEffect(() => {
    
      return () => {
        editor && editor.destroy()
      }
    
    
  }, [editor])
  return (
    
    <EditorContext.Provider value={editor}>
      
       {!!editor && <><div className="custom-inline-strong">
      <BoldButton />
      <ItalicButton />
      <UnderlineButton />
      <StrikethroughButton />
      <RedColorButton />
      <BlueColorButton />
      <HighlightButton />
      <SmallSizeButton />
      <LargeSizeButton />
      <RemoveFormatButton />
      <BulletListButton />
      <OrderListButton />
      <IndentMoreButton />
      <IndentLessButton />
      <InsertLinkButton  onClick={() => setShowLinkDialog(true)} />
    </div>
  
    
    </>}
    <div ref={rootRef} />
    {showLinkDialog && <LinkDialog onCancel={() => setShowLinkDialog(false)} />}


    
    </EditorContext.Provider>
    
  );
}

export default App;
