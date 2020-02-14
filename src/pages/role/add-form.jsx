import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'

class AddForm extends Component{

    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    // the form convey children to father
    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render(){
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 15 },
        }

        return(
            <Form>

                <Form.Item label="Role's Name" {...formItemLayout}>
                    {
                        getFieldDecorator(
                            'roleName',{
                                initialValue: ''
                            }
                        )(
                            <Input placeholder='Please enter role name'/>
                        )
                    }
                </Form.Item>

            </Form>
        )
    }
}

export default Form.create()(AddForm)