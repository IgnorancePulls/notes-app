const getMentionNoteToDelete = (range: Range): HTMLElement | null => {
    const node = range.startContainer;
    const offset = range.startOffset;

    // Check if the cursor is inside a mention
    if (
        node.nodeType === Node.TEXT_NODE &&
        node.parentNode instanceof HTMLElement &&
        node.parentNode.tagName === 'SPAN' &&
        node.parentNode.classList.contains('mention')
    ) {
        return node.parentNode as HTMLElement;
    }

    // Check if the cursor is just before a mention
    if (
        offset === 1 &&
        node.nodeType === Node.TEXT_NODE &&
        node.previousSibling instanceof HTMLElement &&
        node.previousSibling.tagName === 'SPAN' &&
        node.previousSibling.classList.contains('mention')
    ) {
        return node.previousSibling as HTMLElement;
    }

    return null;
};

export { getMentionNoteToDelete };
