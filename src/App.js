import logo from './logo.svg';
import './App.css';

import MyEditor from './components/MyEditor';
import MyMentionsInput from './components/MentionsEditor';

function App() {
	return (
		<div className="App">
			<h1>Hello</h1>

			<MyEditor />

			<hr />

			<h1>React Mentions Example</h1>
			<MyMentionsInput />
		</div>
	);
}

export default App;
