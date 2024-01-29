import React, { useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import '../App.css';

const MyMentionsInput = () => {
    const [value, setValue] = useState('');

    const users = [
        { id: '1', display: 'Alice' },
        { id: '2', display: 'Bob' },
        { id: '3', display: 'Charlie' }
    ];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const renderMention = (mention, search, highlightedDisplay, index, focused) => {
        return (
            <span key={index} className="">
                {highlightedDisplay}
            </span>
        );
    };

    return (
        <MentionsInput value={value} onChange={handleChange} style={{ minWidth: '400px', padding: '5px' }}>
            <Mention
                trigger="@"
                data={users}
                // className="mention"
                style={{ backgroundColor: "beige" }}
                renderSuggestion={renderMention}
                displayTransform={(id, display) => "@" + (display)}
            />
        </MentionsInput>
    );
};

export default MyMentionsInput;
