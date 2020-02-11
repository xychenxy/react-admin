import store from 'store'

const USER_KEY = 'user_key'

export default {
    saveUser(user){
        store.set(USER_KEY, user)
    },
    getUser(){
        // as return value maybe null, so we need to add || {} to avoid error
        return store.get(USER_KEY) || {}
    },
    removeUser(){
        store.remove(USER_KEY)
    },
}