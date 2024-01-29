// MyEditor.js
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, Modifier, SelectionState, RichUtils } from 'draft-js';

const MyEditor = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [search, setSearch] = useState('');

    const styleMap = {
        'HIGHLIGHT': {
            backgroundColor: 'beige',
            fontWeight: 'bold',
        },
    };

    const handleBeforeInput = (chars) => {
        const selection = editorState.getSelection();
        const anchorKey = selection.getAnchorKey();
        const currentContent = editorState.getCurrentContent();
        const currentBlock = currentContent.getBlockForKey(anchorKey);
        const start = selection.getStartOffset();
        const text = currentBlock.getText().slice(0, start) + chars;

        if (text.endsWith('@')) {
            setShowSuggestions(true);
            setSearch('@');
            // return 'handled';
        }

        if (showSuggestions) {
            if (chars === ' ') {
                setShowSuggestions(false);
                setSearch('');
            } else {
                setSearch(text.slice(text.lastIndexOf('@')));
            }
            // return 'handled';
        }

        return 'not-handled';
    };

    const handleKeyCommand = (command) => {
        if (command === 'enter' && showSuggestions) {
            selectSuggestion(suggestions[0]);
            return 'handled';
        }
        return 'not-handled';
    };

    const selectSuggestion = (suggestion) => {
        let currentContent = editorState.getCurrentContent();
        let selection = editorState.getSelection();

        // Calculate the start offset for the replacement
        const startOffset = selection.getStartOffset() - search.length;

        // Define a selection state for the text to be replaced
        const replacementSelection = selection.merge({
            anchorOffset: startOffset,
            focusOffset: selection.getStartOffset(),
        });

        // Insert the suggestion text with a trailing space
        const textWithSuggestion = `@${suggestion}`;
        currentContent = Modifier.replaceText(
            currentContent,
            replacementSelection,
            textWithSuggestion
        );

        // Apply the 'HIGHLIGHT' style to the suggestion text only
        const styledSelection = replacementSelection.merge({
            focusOffset: startOffset + textWithSuggestion.length,
        });
        currentContent = Modifier.applyInlineStyle(
            currentContent,
            styledSelection,
            'HIGHLIGHT'
        );

        // Insert a space after the styled text
        const spaceSelection = styledSelection.merge({
            anchorOffset: styledSelection.getFocusOffset(),
            focusOffset: styledSelection.getFocusOffset(),
        });
        currentContent = Modifier.insertText(
            currentContent,
            spaceSelection,
            ' '
        );

        // Update the editor state with the styled text and space
        let newEditorState = EditorState.push(
            editorState,
            currentContent,
            'change-inline-style'
        );

        // Move the cursor to the position after the space
        newEditorState = EditorState.forceSelection(newEditorState, currentContent.getSelectionAfter());

        setEditorState(newEditorState);
        setShowSuggestions(false);
        setSearch('');
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const mockUsers = ['Alice', 'Bob', 'Charlie'];
            if (search === '@') {
                setSuggestions(mockUsers);
            } else {
                setSuggestions(mockUsers.filter(user =>
                    user.toLowerCase().startsWith(search.toLowerCase().substring(1))
                ));
            }
        };

        if (search.startsWith('@')) {
            fetchUsers();
        } else {
            setSuggestions([]);
        }
    }, [search]);

    return (
        <div style={{ border: '1px solid black', padding: '10px' }}>
            <Editor
                customStyleMap={styleMap}
                editorState={editorState}
                onChange={setEditorState}
                handleBeforeInput={handleBeforeInput}
                handleKeyCommand={handleKeyCommand}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div style={{ border: '1px solid grey', padding: '5px' }}>
                    {suggestions.map((suggestion, index) => (
                        <div key={index} onClick={() => selectSuggestion(suggestion)}>
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEditor;
