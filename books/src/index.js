import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { HashRouter, Route } from 'react-router-dom';
import Login from './Login';
import App from './App';
import ReadBook from './pages/ReadBook';
import BookDetail from './pages/BookDetail';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <HashRouter>
        <div className="container">
            <Route path="/" exact component={Login} />
            <Route path="/app/:userID" component={App} />
            <Route path="/bookDetail/:bookID/:userID" exact component={BookDetail} />
            <Route path="/readBook/:bookID/:userID/:location" exact component={ReadBook} />
        </div>
    </HashRouter>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
