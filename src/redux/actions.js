import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './action-types'

import {message} from "antd";
import storageUtils from "../utils/storageUtils";
import memoryUtils from "../utils/memoryUtils";
import {reqLogin} from "../api";


export const setHeadTitle = (headTitle) => ({type:SET_HEAD_TITLE, data:headTitle})
export const receiveUser = (user) => ({type: RECEIVE_USER, data:user})
export const showErrorMsg = (msg) => ({type: SHOW_ERROR_MSG, data:msg})
export const logout = () => ({type: RESET_USER})


export const login = (username, password) =>{
    return async dispatch => {
        const response = await reqLogin(username, password)
        if(response.status === 0){
            message.success('Login Success', 2)
            const user = response.data
            // save the user in the browser localStorage
            storageUtils.saveUser(user)
            // save the user in the memory
            memoryUtils.user = user
            dispatch(receiveUser(user))
        }else {
            const msg = response.msg
            message.error("Username or Password is wrong.")
            dispatch(showErrorMsg(msg))
        }
    }
}



