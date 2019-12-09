/*

    include axios
    the return value is promise object
    axios.get()
    axios.post()

 */

import axios from 'axios'
import {message} from "antd";
export default function ajax(url, data={}, type='GET'){

    // customize a new Promise
    return new Promise((resolve, reject) =>{
        let promise
        // execute ajax request
        if (type === 'GET'){
            promise = axios.get(url, {
                params:data
            })
        }else {
            promise =  axios.post(url, data)
        }

        promise.then(response =>{
            // success
            resolve(response.data)
        }).catch(error=>{
            message.error('Request error: ' + error.message)
        })
    })


}

