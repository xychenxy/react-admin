import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd';

import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from "../../config/menuConfig";

const { SubMenu } = Menu;

class LeftNav extends Component{


    /*
        generate <menu> children array
     */
    getMenuNodes_map = (menuList) =>{
        return menuList.map(item => {
            if(!item.children){
                return (
                    <Menu.Item
                        key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else {
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
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }

        })
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
        this.menuNodes = this.getMenuNodes(menuList)
    }


    render(){
        const selectKey = this.props.location.pathname
        const openKey = this.openKey

        return(
            <div>
                <div className="left-nav">
                    <Link to="/"  className="left-nav-header">
                        {/*<img src={logo} alt="logo"/>*/}
                        <h1>XY STUDIO</h1>
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


export default withRouter(LeftNav)