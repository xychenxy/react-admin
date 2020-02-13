import React, {PureComponent} from 'react';
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,
    Button,
    message,
} from 'antd'
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
import LinkButton from "../../components/link-button/link-button";
import {reqCategories, reqAddOrUpdateProduct} from "../../api";

const {Item} = Form
const { TextArea } = Input


class ProductAddUpdate extends PureComponent{
    state = {
        options: [],
    }

    constructor(props){
        super(props)
        this.pw = React.createRef()
        this.editor = React.createRef()
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

    initOptions = async (categories) =>{
        // According to categories to generate options array
        const options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false // true means don't have subcategory
        }))

        // if it is a sub level ask for update
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId!=='0'){
            // get level 2 list
            const subCategories = await this.getCategories(pCategoryId)
            const childOptions = subCategories.map(c => (
                {
                    value: c._id,
                    label: c.name,
                    isLeaf: true
                }
            ))
            const targetOption = options.find(options => options.value===pCategoryId)
            targetOption.children = childOptions
        }

        // update option state
        this.setState({options})

    }


    submit = () =>{
        // form validation
        this.props.form.validateFields((err, values) =>{
            if(!err){


                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()


                message.success("Submit Success")
            }else {
                message.error("Submit Fail")
            }
        })
    }

    componentDidMount () {
        this.getCategories('0')
    }

    componentWillMount() {
        // get the convey state
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }

    render(){

        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        const categoryIds = []
        if(isUpdate){
            if (pCategoryId === '0'){
                categoryIds.push(categoryId)
            }else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }

        }

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

                <span> {isUpdate ? 'Update Product' : 'Add Products'} </span>
            </span>
        )

        return(
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="Product Name">
                        {
                            getFieldDecorator('name', {
                                // initialValue: product.name,
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: 'Please enter product name'}
                                ]
                            })(<Input placeholder='Please enter product name'/>)
                        }
                    </Item>
                    <Item label="Product Description">
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    {required: true, message: 'Please enter product description'}
                                ]
                            })(<TextArea placeholder="Please enter product description" autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }

                    </Item>
                    <Item label="Product Price">
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: 'Please enter product price'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' placeholder='Please enter product price' addonBefore='$'/>)
                        }
                    </Item>
                    <Item label="Product Category">
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
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
                    <Item label="Product Images">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="Product Details" labelCol={{span:4}} wrapperCol={{span:18}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>Submit</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}


export default Form.create()(ProductAddUpdate)