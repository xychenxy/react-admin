import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd';

import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from "../../config/menuConfig";
import {connect} from 'react-redux'
import {setHeadTitle} from '../../redux/actions'

const { SubMenu } = Menu;

class LeftNav extends Component{


    /*
        generate <menu> children array
     */
    getMenuNodes_map = (menuList) =>{

        // get current path
        const path = this.props.location.pathname

        return menuList.map(item => {
            // check if user has authorize right to visit this menu
            if(this.hasAuth(item)){

                if(!item.children){
                    if(item.key===path || path.indexOf(item.key)===0){
                        this.props.setHeadTitle(item.title)
                    }
                    return (
                        <Menu.Item
                            key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }else {
                    // confirm openKey
                    if(item.children.find(cItem => path.indexOf(cItem.key)===0)){
                        this.openKey = item.key
                    }


                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>
                            }
                        >
                            {this.getMenuNodes_map(item.children)}
                        </SubMenu>
                    )

                }
            }
        })
    }

    /**
     * 1. admin has rights to visit all.
     * 2. the menus exist in the user's key
     * 3. all the users can visit home
     * @param item
     */
    hasAuth = (item) =>{
        const {key, isPublic} = item
        const menus = this.props.user.role.menus
        const username = this.props.user.username

        if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if(item.children){
            return !!item.children.find(child => menus.indexOf(child.key)!==-1)
        }

        return false



    }

    /*
        generate by reduce
     */
    getMenuNodes = (menuList) =>{

        // get the current path
        const path = this.props.location.pathname

        return menuList.reduce((pre, item)=>{
            if(!item.children){
                pre.push((
                    <Menu.Item
                        key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            }else{
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))

                // item.children is also an object
                // if request router is an item of submenu, set the key as openKey
                // which means when you refresh page, the selected menu still open
                // The find() method returns the value of the first element in an array that pass a test (provided as a function).
                // cItem is each object
                if(item.children.find(cItem => path.indexOf(cItem.key)===0)) {
                    this.openKey = item.key
                }
            }
            return pre
        }, [])
    }

    /*
        before execute render()
        run this
     */
    componentWillMount() {
        this.menuNodes = this.getMenuNodes_map(menuList)
    }


    render(){
        let selectKey = this.props.location.pathname
        if(selectKey.indexOf('/product')===0){
            selectKey = '/product'
        }
        const openKey = this.openKey

        return(
            <div>
                <div className="left-nav">
                    <Link to="/"  className="left-nav-header">
                        <img src={logo} alt="logo"/>
                        <h1>React</h1>
                    </Link>

                    <div style={{ width: '100%' }}>
                        <Menu
                            mode="inline"
                            theme="dark"
                            selectedKeys={[selectKey]}
                            defaultOpenKeys={[openKey]}
                        >

                            {
                                this.menuNodes
                            }

                        </Menu>
                    </div>
                </div>

            </div>

        )
    }
}


export default connect(
    state => ({user:state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))