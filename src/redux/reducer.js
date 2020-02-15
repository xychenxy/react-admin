

import {combineReducers} from 'redux'
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './action-types'
import storageUtils from "../utils/storageUtils";


function headTitle(state = '', action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

const initUser = storageUtils.getUser()
function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.data
        case SHOW_ERROR_MSG:
            const msg = action.data
            return {...state, msg}
        case RESET_USER:
            storageUtils.removeUser()
            return {}
        default:
            return state
    }
}

export default combineReducers({
    headTitle,
    user
})