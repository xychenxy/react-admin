import React, {Component} from 'react';
import {
    Form,
    Select,
    Input
} from 'antd'

class AddForm extends Component{


    render(){
        const {getFieldDecorator} = this.props.form

        return(
            <Form>

                <Form.Item>
                    {
                        getFieldDecorator(
                            'parentId',{
                                initialValue:'0'
                            }
                        )(
                            <Select>
                                <Select.Option value='0'>Category</Select.Option>
                                <Select.Option value='1'>Computers</Select.Option>
                                <Select.Option value='2'>TVs</Select.Option>
                            </Select>
                        )
                    }
                </Form.Item>

                <Form.Item>
                    {
                        getFieldDecorator(
                            'categoryName',{
                                initialValue:''
                            }
                        )(
                            <Input placeholder='Please enter category name'></Input>
                        )
                    }
                </Form.Item>

            </Form>
        )
    }
}

export default Form.create()(AddForm)