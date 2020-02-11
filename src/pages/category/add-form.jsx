import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

class AddForm extends Component{

    static propTypes = {
        categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    // the form convey children to father
    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render(){
        const {getFieldDecorator} = this.props.form
        const {categories, parentId} = this.props

        return(
            <Form>

                <Form.Item>
                    {
                        getFieldDecorator(
                            'parentId',{
                                initialValue: parentId
                            }
                        )(
                            <Select>
                                <Select.Option value='0'>Category</Select.Option>
                                {
                                    categories.map(c => <Select.Option value={c._id}>{c.name}</Select.Option>)
                                }

                            </Select>
                        )
                    }
                </Form.Item>

                <Form.Item>
                    {
                        getFieldDecorator(
                            'categoryName',{
                                initialValue:'',
                                rules:[
                                    {required:true, message:'Please enter category name'}
                                ]
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