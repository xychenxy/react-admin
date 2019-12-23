


import ajax from "./ajax";
import jsonp from 'jsonp'
import {message} from "antd";

export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

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

export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId})
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add',{parentId, categoryName}, 'POST')
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')