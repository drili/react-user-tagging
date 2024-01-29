// MyEditor.js
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, Modifier, SelectionState } from 'draft-js';

const MyEditor = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async (query) => {
            const mockUsers = ['Alice', 'Bob', 'Charlie'];
            setSuggestions(mockUsers.filter(user =>
                user.toLowerCase().includes(query.toLowerCase().replace('@', ''))
            ));
        };

        if (search.startsWith('@') && search.length > 1) {
            fetchUsers(search);
        } else {
            setSuggestions([]);
        }
    }, [search]);

    const handleBeforeInput = (chars) => {
        const selection = editorState.getSelection();
        const anchorKey = selection.getAnchorKey();
        const currentContent = editorState.getCurrentContent();
        const currentBlock = currentContent.getBlockForKey(anchorKey);
        const start = selection.getStartOffset();
        const text = currentBlock.getText().slice(0, start + 1);

        if (text.endsWith('@') || (showSuggestions && chars !== ' ')) {
            setShowSuggestions(true);
            setSearch(text.slice(text.lastIndexOf('@')) + chars);
            return 'handled';
        }

        if (showSuggestions && chars === ' ') {
            setShowSuggestions(false);
            setSearch('');
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
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        // Calculate the position to replace from (right after the "@")
        const startOffset = selection.getStartOffset() - search.length;
        const endOffset = selection.getStartOffset();

        // Define a selection state for the text to be replaced
        const textSelection = selection.merge({
            anchorOffset: startOffset,
            focusOffset: endOffset,
        });

        // Replace the search text with the suggestion
        const textWithSuggestion = `@${suggestion} `;
        const newContentState = Modifier.replaceText(
            currentContent,
            textSelection,
            textWithSuggestion
        );

        const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
        setEditorState(newEditorState);
        setShowSuggestions(false);
        setSearch('');
    };


    return (
        <div style={{ border: '1px solid black', padding: '10px' }}>
            <Editor
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
