import { css } from '@emotion/react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DROP_COMMAND,
  LexicalEditor
} from 'lexical'
import { useEffect, useRef, useState } from 'react'
import { MdDragIndicator } from 'react-icons/md'

interface Props {
  mousePosition: { x: number; y: number }
}

const DraggableHandle: React.FC<Props> = props => {
  const [editor] = useLexicalComposerContext()
  const draggingElm = useRef(null)
  const getBlockElm = (editor: LexicalEditor) => {
    const blockElmKeys = editor._editorState._nodeMap.get('root').__children
    return blockElmKeys.map(val => editor.getElementByKey(val))
  }
  const setHandlePosition = (
    mousePosition: { x: number; y: number },
    blockElms: any
  ) => {
    const targetElm = getTargetElm(mousePosition, blockElms)
    return targetElm
      ? css({
          display: 'flex',
          justifyItems: 'center',
          position: 'absolute',
          top:
            String(
              targetElm.getBoundingClientRect().y +
                targetElm.getBoundingClientRect().height / 2 -
                12
            ) + 'px',
          left: String(targetElm.getBoundingClientRect().x - 24) + 'px'
        })
      : css({
          display: 'flex',
          justifyItems: 'center',
          position: 'absolute',
          top: '0px',
          left: '0px'
        })
  }
  const getTargetElm = (mousePosition, blockElms): HTMLElement => {
    const isContainPointer = (mousePosition, blockElm) => {
      const isInHorizotal =
        (mousePosition.x + 24 - blockElm.getBoundingClientRect().left) *
          (mousePosition.x - blockElm.getBoundingClientRect().right) <
        0
      const isInVertical =
        (mousePosition.y - blockElm.getBoundingClientRect().top) *
          (mousePosition.y - blockElm.getBoundingClientRect().bottom) <=
        0
      return isInHorizotal === true && isInVertical === true
    }
    const targetElm = blockElms.find(elm =>
      isContainPointer(mousePosition, elm)
    )
    return targetElm
  }

  const onDragStart = (e, mousePosition, blockElms) => {
    const dataTransfer = e.dataTransfer
    const targetElm = getTargetElm(mousePosition, blockElms)
    dataTransfer.setDragImage(targetElm, 0, 0)
    let nodeKey = ''
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(targetElm)
      if (node) {
        nodeKey = node.getKey()
      }
    })
    dataTransfer.setData('draggingNode', nodeKey)
  }

  const onDragEnd = (e, mousePosition, blockElms) => {
    const targetLineElm = draggingElm.current
    const targetElm = getTargetElm(mousePosition, blockElms)
    hideTargetLine(targetLineElm)
    editor.update(() => {
      const test = $getNearestNodeFromDOMNode(targetElm)
    })
  }

  const onDragOver = (e: DragEvent) => {
    const targetLineElm = draggingElm.current
    const mousePosition = {
      x: e.pageX,
      y: e.pageY
    }
    const targetBlockElm = getTargetElm(mousePosition, getBlockElm(editor))
    setTargetLine(mousePosition, targetLineElm, targetBlockElm)
    e.preventDefault()
    return true
  }
  const setTargetLine = (
    mousePosition,
    targetLineElm,
    targetBlockElm: HTMLElement
  ) => {
    const targetBlockRect = targetBlockElm.getBoundingClientRect()
    const left = targetBlockRect.x
    const top =
      mousePosition.y > targetBlockRect.y + targetBlockRect.height / 2
        ? targetBlockRect.y + targetBlockRect.height
        : targetBlockRect.y
    targetLineElm.style.transform = `translate(${left}px, ${top}px)`
    targetLineElm.style.width = `${targetBlockRect.width}px`
    targetLineElm.style.opacity = 1
  }
  const hideTargetLine = targetLineElm => {
    targetLineElm.style.transform = `translate(-10000px, -10000px)`
    targetLineElm.style.opacity = 0
  }
  const onDrop = (e: DragEvent) => {
    const mousePosition = {
      x: e.pageX,
      y: e.pageY
    }
    const targetBlockElm = getTargetElm(mousePosition, getBlockElm(editor))
    const targetBlockRect = targetBlockElm.getBoundingClientRect()
    const draggingNode = $getNodeByKey(e.dataTransfer.getData('draggingNode'))
    const targetNode = $getNearestNodeFromDOMNode(targetBlockElm)
    const shouldInsertAfter =
      e.pageY > targetBlockRect.y + targetBlockRect.height / 2 ? true : false
    if (shouldInsertAfter) {
      targetNode.insertAfter(draggingNode)
    } else {
      targetNode.insertBefore(draggingNode)
    }

    return true
  }
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        DRAGOVER_COMMAND,
        e => {
          onDragOver(e)
          return true
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DROP_COMMAND,
        e => {
          onDrop(e)
          return true
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  })
  return (
    <>
      <div
        css={setHandlePosition(props.mousePosition, getBlockElm(editor))}
        draggable={true}
        onDragStart={e =>
          onDragStart(e, props.mousePosition, getBlockElm(editor))
        }
        onDragEnd={e => onDragEnd(e, props.mousePosition, getBlockElm(editor))}
      >
        <MdDragIndicator css={styles.dragIcon} />
      </div>
      <div css={styles.targetLine} ref={draggingElm} />
    </>
  )
}

export default DraggableHandle

const styles = {
  handle: css({
    position: 'absolute',
    top: '0px',
    left: '0px'
  }),
  dragIcon: css({
    color: 'gray',
    fontSize: '24px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#eeeeee'
    }
  }),
  targetLine: css({
    position: 'absolute',
    top: '0px',
    left: '0px',
    border: '1px solid black',
    height: '2px',
    opacity: 1
  })
}
