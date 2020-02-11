import React, {Component} from 'react';
import {Redirect, Switch, Route} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/left-nav/left-nav";
import Header from "../../components/header/header";
import { Layout } from 'antd';
import Home from "../home/home";
import Category from "../category/category";
import Product from "../Product/product";
import Role from "../role/role";
import User from "../user/user";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie"




const {
    Footer,
    Sider,
    Content
} = Layout;



export default class Admin extends Component{

    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render(){

        // check if login
        const user = memoryUtils.user
        if(!user || !user._id){
            // redirect to login page
            return <Redirect to='/login/' />
        }

        return(
            <Layout style={{height:'100%'}}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    <Content style={{margin:'20px 20px 0px',backgroundColor: 'white'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path="/charts/bar" component={Bar}/>
                            <Route path="/charts/pie" component={Pie}/>
                            <Route path="/charts/line" component={Line}/>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#aaaaaa'}}>XY STUDIO@COPY RIGHT</Footer>
                </Layout>
            </Layout>
        )
    }
}