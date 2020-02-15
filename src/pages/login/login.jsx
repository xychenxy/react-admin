import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import memoryUtils from "../../utils/memoryUtils";
import {
    Form,
    Input,
    Icon,
    Button,
    message
} from 'antd'
import {connect} from 'react-redux'
import {login} from "../../redux/actions";

import logo from './images/logo.png'
import './login.less'


class Login extends Component{

    /*
        username and password validation rules
        1. not allow empty
        2. greater or equal 4
        3. less or equal 12
        4. a-zA-Z0-10_
     */

    /*
        await & async
     */
    login = (e) =>{
        e.preventDefault()

        this.props.form.validateFields(async (err, values)=>{
            if (!err){
                const {username, password} = values
                this.props.login(username, password)
            }else {
                // console.log(err)
            }
        })
    }


    /**
     * customize validator
     * callback have to use. if no parameter which means valid success
     * callback receives message if no pass
     */
    validator = (rule, value, callback) =>{
        const length = value && value.length
        const pwdReg = /^[a-zA-Z0-9_]+$/

        if(!value){
            callback('Please input your password!')
        }else if (length<4){
            callback("Password should great than 4")
        }else if (length>12){
            callback("Password should less than 12")
        }else if (!pwdReg.test(value)){
            callback("Username should be consisted of letter, number and -")
        }else {
            // Success
            callback()
        }
    }


    render(){
        const user = this.props.user
        // check if login
        if (user && user._id) {
            return <Redirect to='/'/>
        }

        const {getFieldDecorator} = this.props.form;

        return(
            <div className="login">

                <header className="login-header">
                    <img src={logo} alt="log"/>
                    <h1>React Project: Admin System</h1>
                </header>

                <section className="login-content">
                    <h3>Login</h3>
                    <Form onSubmit={this.login} className="login-form">

                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [
                                    { required: true, message: 'Please input your username!' },
                                    { min: 4, message: 'Username should great than 4'},
                                    { max: 12, message: 'Username should less than 12'},
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username should be consisted of letter, number and -'}
                                    ],
                                initialValue: 'admin'
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>

                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    { validator: this.validator }
                                    ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Login
                            </Button>
                            Or <a href="#">register now!</a>
                        </Form.Item>

                    </Form>
                </section>

            </div>
        )
    }
}

/**
 *  Form is an Object, create() is a method,
 *  Form.create() return a function, and this function need a parameter is Login (Component)
 *  Form.create()(Login) return a new Component
 * @type {ConnectedComponentClass<Login, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */

export default connect(
    state => ({user:state.user}),
    {login}
)(Form.create()(Login))