// MyEditor.js
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, Modifier, SelectionState, CompositeDecorator } from 'draft-js';

const MyEditor = () => {
    const findTaggedUsers = (contentBlock, callback, contentState) => {
        contentBlock.findEntityRanges(
            (character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === 'TAGGED_USER'
                );
            },
            callback
        );
    };
    
    const TaggedUser = (props) => {
        return <strong>{props.children}</strong>;
    };
    
    const decorator = new CompositeDecorator([
        {
            strategy: findTaggedUsers,
            component: TaggedUser,
        },
    ]);
    
    const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [search, setSearch] = useState('');

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
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
    
        const startOffset = selection.getStartOffset() - search.length;
        const endOffset = startOffset + search.length;
    
        const textSelection = selection.merge({
            anchorOffset: startOffset,
            focusOffset: endOffset,
        });
    
        const textWithSuggestion = `@${suggestion} `;
        const newContentState = Modifier.replaceText(
            currentContent,
            textSelection,
            textWithSuggestion
        );
    
        const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
        setEditorState(EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter()));
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
