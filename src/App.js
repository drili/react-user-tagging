import logo from './logo.svg';
import './App.css';

import MyEditor from './components/MyEditor';
import MyMentionsInput from './components/MentionsEditor';
import MyRichTextEditor from './components/MentiosWithDraft';
import SimpleMentionEditor from './components/MentionsWithDraft2.tsx';

function App() {
	return (
		<div className="App">
			<h1>Hello</h1>

			<MyEditor />

			<hr />

			<h1>React Mentions Example</h1>
			<MyMentionsInput />

			<hr />

			{/* <h1>React Mentions & Draft.js</h1> */}
			{/* <MyRichTextEditor /> */}

			<h1>React Mentions with Draft 2</h1>
			<SimpleMentionEditor />
		</div>
	);
}

export default App;
