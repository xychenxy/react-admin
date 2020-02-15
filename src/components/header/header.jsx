import React, {Component} from 'react';
import {reqWeather} from "../../api";
import {formatDate} from "../../utils/dateUtils";
import {withRouter} from 'react-router-dom'
import menuList from "../../config/menuConfig";
import LinkButton from "../link-button/link-button";
import { Modal } from 'antd';
import {connect} from "react-redux";
import {logout} from "../../redux/actions";
import './index.less'

/*
    The weather data is provided by open weather
    https://openweathermap.org/current

 */

class Header extends Component{

    state = {
        currentTime: formatDate(Date.now()),
        main:'', // weather state
        icon_url:'', // weather image
        temp:'' // weather temperature
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
        let title = ''
        menuList.forEach(item =>{
            if (item.key === path){
                title = item.title
            }else if (item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
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
                this.props.logout()
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


    // prevent memory lead
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }


    render(){

        const {currentTime, main, icon_url, temp} = this.state
        const username = this.props.user.username
        // const title = this.getTitle()
        const title = this.props.headTitle

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

export default connect(
    state => ({headTitle:state.headTitle, user:state.user}),
    {logout}
)(withRouter(Header))