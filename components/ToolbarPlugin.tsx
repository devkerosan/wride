import { $getSelection, $isRangeSelection } from "lexical";
import { $wrapNodes } from "@lexical/selection"
import { $createHeadingNode } from "@lexical/rich-text"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FC, useCallback, useState } from "react";
import { HeadingTagType } from "@lexical/rich-text";
const SupportedBlockType = {
    paragraph: "Paragraph",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
} as const;
type BlockType = keyof typeof SupportedBlockType;


const ToolbarPlugin: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const [blockType, setBlockType] = useState<BlockType>("paragraph");
    const formatHeading = useCallback(
        (type: HeadingTagType) => {
            if (blockType !== type) {
                editor.update(() => {
                    const selection = $getSelection();
                    console.log(selection)
                    if ($isRangeSelection(selection)) {
                        $wrapNodes(selection, () => $createHeadingNode(type));
                    }
                });
            }
        },
        [blockType, editor],
    );
    return (
        <>
            <div className=''>
                <button onClick={() => formatHeading("h1")}>h1</button>
            </div>
        </>

    )
};

export default ToolbarPlugin;