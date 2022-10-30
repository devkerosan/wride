import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { css } from '@emotion/react'
import ToolbarPlugin from './ToolbarPlugin'
import { HeadingNode } from '@lexical/rich-text'
import { Klass, LexicalNode } from 'lexical'
import DraggableHandle from './DraggableHandle'
import { useState } from 'react'

const nodes: Klass<LexicalNode>[] = [HeadingNode]

const TextEditorField: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const theme = {}
  const onError = () => {
    console.log('error')
  }
  const onChange = () => {
    console.log('changed')
  }
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: nodes
  }
  // const [editor] = useLexicalComposerContext();
  const handleClick = () => {
    console.log()
  }

  return (
    <div
      css={styles.container}
      onMouseMove={e => setMousePosition({ x: e.clientX, y: e.clientY })}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div css={styles.editorBox}>
          <RichTextPlugin
            contentEditable={<ContentEditable css={styles.contentEditable} />}
            placeholder={<div css={styles.placeholder}>Enter some text...</div>}
          />
        </div>
        <DraggableHandle mousePosition={mousePosition} />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  )
}

export default TextEditorField

const styles = {
  placeholder: css({
    position: 'absolute',
    top: '4px',
    left: '28px',
    userSelect: 'none',
    pointerEvents: 'none',
    color: 'gray'
  }),
  editorBox: css({
    position: 'relative'
  }),
  contentEditable: css({
    border: 0,
    outline: 0,
    marginBlockStart: '0em',
    marginBlockEnd: '0em',
    paddingLeft: '24px'
  }),
  container: css({
    margin: '8px',
    padding: '8px'
  })
}
