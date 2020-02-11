import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'

class UpdateForm extends Component{

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    // the form convey children to father
    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render(){
        const {categoryName} = this.props
        const {getFieldDecorator} = this.props.form

        return(
            <Form>

                <Form.Item>
                    {
                        getFieldDecorator(
                            'categoryName',
                            {
                                initialValue:categoryName,
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

export default Form.create()(UpdateForm)