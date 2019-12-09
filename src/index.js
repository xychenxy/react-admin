import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";
// import 'antd/dist/antd.css'

// read user info, save to memory
const user = storageUtils.getUser()
if(user && user._id){
    memoryUtils.user = user
}




ReactDOM.render(<App />, document.getElementById('root'));


