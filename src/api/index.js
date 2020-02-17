


import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from "antd";

const BASE = '/api'

/**
 * Login
 * @param username
 * @param password
 * @returns {*|Promise|Promise<unknown>}
 */
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

/**
 * Open weather
 * @param city
 * @returns {Promise<unknown>}
 */
export const reqWeather = (city) =>{

    return new Promise((resolve, reject)=>{
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&id=524901&APPID=a6a299e4189d5f36235b72b6f5d55495&units=metric`
        jsonp(url, {}, (err, data)=>{

            if (!err && data.cod===200){
                const {main, icon} = data.weather[0]
                const {temp}  = data.main
                const icon_url = `http://openweathermap.org/img/wn/${icon}@2x.png`

                resolve({main, icon_url, temp})
            }else{
                message.error('Cannot get weather info.')
            }
        })
    })
}

/**
 * Categories management
 * @param parentId
 * @returns {*|Promise|Promise<unknown>}
 */
export const reqCategories = (parentId) => ajax(BASE + '/manage/category/list', {parentId})
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add',{parentId, categoryName}, 'POST')
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

/**
 * Products management
 * @param pageNum
 * @param pageSize
 * @returns {*|Promise|Promise<unknown>}
 */
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})
export const reqUpdateStatus = (productId, status) => ajax( BASE + '/manage/product/updateStatus', {productId, status}, 'POST')
export const reqAddOrUpdateProduct = (product) => ajax( BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')
//searchType: productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search',
    {
        pageNum,
        pageSize,
        [searchType]: searchName,
    })
// get the category info
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})
export const reqDeleteImg = (name) => ajax( BASE + '/manage/img/delete', {name}, 'POST')

/**
 * Roles management
 * @returns {*|Promise|Promise<unknown>}
 */
export const reqRoles = () => ajax(BASE + '/manage/role/list')
export const reqAddRole = (roleName) => ajax( BASE + '/manage/role/add', {roleName}, 'POST')
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

/**
 * Users management
 * @returns {*|Promise|Promise<unknown>}
 */
export const reqUsers = () => ajax(BASE + '/manage/user/list')
export const reqDeleteUser = (userId) => ajax(  BASE + '/manage/user/delete', {userId}, 'POST')
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')
