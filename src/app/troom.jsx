import React from 'react';
import {render} from 'react-dom';
import css from '../style/room.scss';

class App extends React.Component {
    render() {
        return <p id="room"> welcome to room!</p>
    }
}

render(<App />, document.getElementById('app'));