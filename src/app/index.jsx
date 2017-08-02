import React from 'react';
import {render} from 'react-dom';
import css from '../style/common.scss';

class App extends React.Component {
    render() {
        return <div id="editor">       	
        	<p>welcome to index!</p>
        	<a href="troom.html">跳转</a>
        	{
        		__DEV__?console.log('i am a test'):''
        	}
        </div>
    }
}

render(<App />, document.getElementById('app'));