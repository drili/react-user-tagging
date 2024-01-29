import React, { useRef, useState, useMemo, useCallback } from 'react';
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import mentions from './Mentions';

import '../App2.css';

const SimpleMentionEditor = () => {
    const ref = useRef(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(mentions);

    const { MentionSuggestions, plugins } = useMemo(() => {
        const mentionPlugin = createMentionPlugin();
        const { MentionSuggestions } = mentionPlugin;
        const plugins = [mentionPlugin];
        return { plugins, MentionSuggestions };
    }, []);

    const onOpenChange = useCallback((open) => {
        setOpen(open);
    }, []);

    const onSearchChange = useCallback(({ value }) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions));
    }, []);

    const MentionEntry = (props) => {
        const { ...parentProps } = props
        return (
            <div {...parentProps} className="mentionEntry">
                <img src={props.mention.avatar} />
                <span>{props.mention.name}</span>
            </div>
        );
    };

    return (
        <div
            style={{ border: '1px solid black', padding: '10px' }}
            onClick={() => {
                ref.current && ref.current.focus();
            }}
        >
            <Editor
                editorKey="editor"
                editorState={editorState}
                onChange={setEditorState}
                plugins={plugins}
                ref={ref}
            />
            <MentionSuggestions
                open={open}
                onOpenChange={onOpenChange}
                suggestions={suggestions}
                onSearchChange={onSearchChange}
                entryComponent={MentionEntry}
                onAddMention={() => {
                    // get the mention object selected
                }}
                popoverContainer={({ children }) => <div>{children}</div>}
            // onAddMention={() => { /* handle mention addition */ }}
            />
        </div>
    );
};

export default SimpleMentionEditor;
