import React, {PureComponent} from 'react';
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message,
    Upload
} from 'antd'
import LinkButton from "../../components/link-button/link-button";
import {reqCategories, reqAddOrUpdateProduct} from "../../api";

const {Item} = Form
const { TextArea } = Input


class ProductAddUpdate extends PureComponent{
    state = {
        options: [],
    }

    /*
        Customize validator
     */
    validatePrice = (rule, value, callback) =>{
        if(value*1 >= 0){
            callback()
        }else {
            callback("Price must greater than or equal to 0")
        }
    }

    submit = () =>{
        // form validation
        this.props.form.validateFields((err, values) =>{
            if(!err){
                message.success("Submit Success")
            }else {
                message.error("Submit Fail")
            }
        })
    }


    /*
        loading product list of the selected item
    */
    loadData = async selectedOptions => {
        // be selected option
        const targetOption = selectedOptions[0]
        // show loading
        targetOption.loading = true

        // according the selected option, request for subcategory
        const subCategorys = await this.getCategories(targetOption.value)

        // hide loading
        targetOption.loading = false

        // if have children
        if (subCategorys && subCategorys.length>0) {
            // create children options
            const childOptions = subCategorys.map(c => (
                {
                    value: c._id,
                    label: c.name,
                    isLeaf: true
                }
            ))
            // assign to parent
            targetOption.children = childOptions
        } else { // don't have children
            targetOption.isLeaf = true
        }

        this.setState({
            options: [...this.state.options],
        })
    }

    /*
    *   According to the parent _id, get the children
    * */
    getCategories = async (parentID) => {
        const result = await reqCategories(parentID)
        if (result.status === 0) {
            const categories = result.data
            if(parentID==='0'){
                // handle level 1 category
                this.initOptions(categories)
            }else {
                // handle level 2 category
                return categories
            }
        }
    }

    initOptions = (categories) =>{
        // According to categories to generate options array
        const options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false // true means don't have subcategory
        }))

        // update option state
        this.setState({options})

    }

    componentDidMount () {
        this.getCategories('0')
    }

    componentWillMount() {


    }


    render(){

        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 }, // left
            wrapperCol: { span: 8 }, // right
        };

        const title = (
            <span>
                <LinkButton>
                  <Icon
                      type='arrow-left'
                      style={{marginRight: 10, fontSize: 20}}
                      onClick={() => this.props.history.goBack()}
                  />
                </LinkButton>

                <span>Add Products</span>
            </span>
        )

        return(
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="Product Name">
                        {
                            getFieldDecorator('name', {
                                // initialValue: product.name,
                                initialValue: 'product.name',
                                rules: [
                                    {required: true, message: 'Please enter product name'}
                                ]
                            })(<Input placeholder='Please enter product name'/>)
                        }
                    </Item>
                    <Item label="Product Description">
                        {
                            getFieldDecorator('desc', {
                                initialValue: 'product.desc',
                                rules: [
                                    {required: true, message: 'Please enter product description'}
                                ]
                            })(<TextArea placeholder="Please enter product description" autosize={{ minRows: 2, maxRows: 6 }} />)
                        }

                    </Item>
                    <Item label="Product Price">

                        {
                            getFieldDecorator('price', {
                                initialValue: 'product.price',
                                rules: [
                                    {required: true, message: 'Please enter product price'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' placeholder='Please enter product price' addonBefore='$'/>)
                        }
                    </Item>
                    <Item label="Product Category">
                        <Cascader
                            placeholder='Please select'
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item label="Product Category">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: 'categoryIds',
                                rules: [
                                    {required: true, message: 'Please choose product category'},
                                ]
                            })(
                                <Cascader
                                    placeholder='Please select'
                                    options={this.state.options}
                                    loadData={this.loadData}
                                />
                            )
                        }

                    </Item>
                    {/*<Item label="商品图片">*/}
                    {/*    <PicturesWall ref={this.pw} imgs={imgs}/>*/}
                    {/*</Item>*/}
                    {/*<Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>*/}
                    {/*    <RichTextEditor ref={this.editor} detail={detail}/>*/}
                    {/*</Item>*/}
                    <Item>
                        <Button type='primary' onClick={this.submit}>Submit</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}


export default Form.create()(ProductAddUpdate)