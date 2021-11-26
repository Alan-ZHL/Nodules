import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import {App} from "./App";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <App />, 
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
setTimeout(() => {
    let navigationEntry = performance.getEntriesByType('navigation')[0];
    console.log(`page load time: ${navigationEntry.loadEventStart - (navigationEntry.unloadEventEnd - navigationEntry.unloadEventStart) -  navigationEntry.fetchStart}`);
    console.log(navigationEntry);
    let resourceEntry = performance.getEntriesByType("resource");
    console.log(resourceEntry);
    let fetchingTime = resourceEntry.filter(resource => resource.initiatorType === 'fetch')[0];
    console.log(`response time for fetching posts at main page: ${fetchingTime.responseStart - fetchingTime.requestStart}`);
}, 3000);