import React, {Component} from 'react';
import {reqWeather} from "../../api";
import {formatDate} from "../../utils/dateUtils";
import {withRouter} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import menuList from "../../config/menuConfig";
import LinkButton from "../link-button/link-button";
import { Modal } from 'antd';
import './index.less'

class Header extends Component{

    state = {
        currentTime: formatDate(Date.now()),
        main:'',
        icon_url:'',
        temp:''
    }

    getTime = () =>{
        this.intervalId = setInterval(()=>{
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getWeather = async () => {
        const {main, icon_url, temp} = await reqWeather("Melbourne")
        this.setState({main, icon_url, temp})
    }

    getTitle = () =>{
        const path = this.props.location.pathname
        let title
        menuList.forEach(item =>{
            if (item.key === path){
                title = item.title
            }else if (item.children){
                // item.children.forEach(subItem=>{
                //     if (path.indexOf(subItem.key)===0){
                //         title = subItem.title
                //     }
                // })
                const cItem = item.children.find(cItem => cItem.key === path)
                if(cItem){
                    title = item.title
                }
            }
        })
        return title
    }

    logout = () =>{
        Modal.confirm({
            content: 'Do you want to logout?',
            onOk: () => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }


    /*
    The first time execute render(), after that, will execute this
    such ajax, set time
     */
    componentDidMount() {
        // update time here
        this.getTime()

        // update weather
        this.getWeather()
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }


    render(){

        const {currentTime, main, icon_url, temp} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()

        return(
            <div className={"header"}>
                <div className={"header-top"}>
                    <span>Hi, {username}</span>
                    <LinkButton onClick={this.logout} >Logout</LinkButton>
                </div>
                <div className={"header-bottom"}>
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{temp}℃</span>
                        <img src={icon_url} alt="weather"/>
                        <span>{main}</span>
                        <span>{currentTime}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)