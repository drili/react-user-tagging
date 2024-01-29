import React, { useState } from 'react';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import { EditorState } from 'draft-js';
import '@draft-js-plugins/mention/lib/plugin.css';

const MyRichTextEditor = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [suggestions, setSuggestions] = useState([]);
    const [isMentionOpen, setIsMentionOpen] = useState(false);

    const users = [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Charlie' }
    ];

    const mentionPlugin = createMentionPlugin({
        mentionPrefix: '@',
    });
    const { MentionSuggestions } = mentionPlugin;
    const plugins = [mentionPlugin];

    const onSearchChange = ({ value }) => {
        const filteredSuggestions = defaultSuggestionsFilter(value, users);
        console.log("Search value:", value);
        console.log("Filtered suggestions:", filteredSuggestions);
        setSuggestions(filteredSuggestions);
        setIsMentionOpen(filteredSuggestions.length > 0);
    };
    

    const EntryComponent = ({ mention, theme, ...parentProps }) => (
        <div {...parentProps}>
            {mention.name}
        </div>
    );

    return (
        <div>
            <Editor
                editorState={editorState}
                onChange={setEditorState}
                plugins={plugins}
            />
            <MentionSuggestions
                open={isMentionOpen}
                onSearchChange={onSearchChange}
                suggestions={suggestions}
                entryComponent={EntryComponent} // Optional
            />
        </div>
    );
};

export default MyRichTextEditor;
