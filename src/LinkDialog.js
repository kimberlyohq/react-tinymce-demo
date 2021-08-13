import React, { useContext, useRef } from 'react'
import { EditorContext } from './EditorContext'

export default function LinkDialog({ onCancel }) {
  const editor = useContext(EditorContext)
  const textRef = useRef()
  const hrefRef = useRef()
  const handleSure = () => {
    editor.focus()
    if (editor.selection.isCollapsed()) {
      editor.execCommand('mceInsertContent', false, `<a href="http://google.com">test</a>`)
    } else {
            editor.execCommand('mceInsertLink', false, hrefRef.current.value)


    }
    onCancel()
   
  }

  return (
    <div style={{ position: 'absolute', border: 1, left: 0, bottom: 0, width: 300, height: 200 }}>
      <input type="text" placeholder="text" defaultValue="insert link content" ref={textRef}  />
      <input type="text" placeholder="href" defaultValue="href" ref={hrefRef} />
      <button onClick={onCancel}>cancel</button>
      <button onClick={handleSure}>sure</button>
    </div>
  )
}
