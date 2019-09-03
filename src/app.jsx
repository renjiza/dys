import React from 'react';
import { Router } from 'react-router-dom';
import Body from './body';
import history from './components/history';


function App() {	
	return (
		<Router history={history}>
			<Body />
		</Router>
	)
}

export default App;
