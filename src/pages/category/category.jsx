import React, {Component} from 'react';
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal
} from 'antd'
import './category.less'
import LinkButton from "../../components/link-button/link-button";
import {reqCategories, reqAddCategory, reqUpdateCategory} from '../../api'
import AddForm from "./add-form";
import UpdateForm from "./update-form"

export default class Category extends Component{

    state = {
        categories:[], // level 1
        subcategories:[], // level 2
        parentId:'0',
        parentName:'',
        loading:false, // before getting data, it is true (showing circle)
        showStatus:0 // 0 none, 1 show add, 2 show update
    }

    /*
        This method is used to get level 1 or 2 category
     */
    getCategories = async (parentId) =>{
        // loading is true that means showing a circle
        this.setState({loading:true})
        parentId = parentId || this.state.parentId
        const result = await reqCategories(parentId)
        this.setState({loading:false})

        if(result.status === 0){
            const categories = result.data
            if(parentId === '0'){
                this.setState({categories})
            }else {
                this.setState({
                    subcategories:categories
                })
            }

        }else {
            message.error('Fail to get category lists!')
        }
    }

    showCategories = () =>{
        this.setState({
            parentId:'0',
            parentName:'',
            // subcategories:[]
        })
    }

    /*
        show level 2 category
     */
    showSubcategories = (category) =>{
        this.setState({
            parentId:category._id,
            parentName:category.name
        }, ()=>{
            this.getCategories()
        })
    }


    handleCancel = () => {

        this.form.resetFields()

        this.setState({
            showStatus: 0
        })
    }

    showAdd = () =>{
        this.setState({
            showStatus : 1
        })
    }

    showUpdate = (category) =>{

        this.category = category
        this.setState({
            showStatus : 2
        })
    }

    addCategory = () =>{

        // valid form
        this.form.validateFields(async (err, values)=>{
            if(!err){
                // 1. hide Modal
                this.setState({
                    showStatus : 0
                })

                // 2. send request to add category
                const parentId = this.form.getFieldValue('parentId')
                const categoryName = this.form.getFieldValue('categoryName')
                this.form.resetFields()
                const result = await reqAddCategory(parentId, categoryName)

                // 3. re-show category table
                if(result.status===0){
                    if (parentId===this.state.parentId){
                        this.getCategories()
                    }else if (parentId === '0'){
                        this.getCategories('0')
                    }

                    message.success("Add Success")
                }else {
                    message.error("Add Fail")
                }
            }else {
                message.error("Please enter category name")
            }
        })

    }

    updateCategory =  () =>{

        // valid form
        this.form.validateFields(async (err, values)=>{
            if(!err){
                // 1. hide the modal
                this.setState({
                    showStatus : 0
                })

                // 2. send request to update category
                const categoryId = this.category._id
                // values also have categoryName, depends on you
                const categoryName = this.form.getFieldValue('categoryName')
                this.form.resetFields()
                const result = await reqUpdateCategory(categoryId, categoryName)

                // 3. re-show category
                if(result.status===0){
                    this.getCategories()
                    message.success('Update Success');
                }else {
                    message.error('Update Fail');
                }
            }else {
                message.error("Please enter category name")
            }
        })



    }


    /*
        Initial all the table
     */
    initColumns = () => {
        this.columns = [
            {
                title: 'Category Name',
                dataIndex: 'name',
            },
            {
                title: 'Operation',
                width: 300,
                /*
                    the below category means each row values, of course,
                    you can change category to another name you like
                 */
                render: (category)=>(
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(category)}>Update</LinkButton>
                        {this.state.parentId === '0' ?
                            <LinkButton onClick={()=>{this.showSubcategories(category)}}>Subcategory</LinkButton> : null
                        }
                    </span>
                )
            },
        ];
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getCategories()

    }


    render(){

        const {categories, subcategories, parentId, parentName, loading, showStatus} = this.state
        const category = this.category || {}

        const title = parentId === '0' ? 'Category' : (
            <span>
                <LinkButton onClick={this.showCategories}>Category</LinkButton>
                <Icon type='arrow-right' style={{marginRight:10}}></Icon>
                <span>{parentName}</span>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'></Icon>
                Add
            </Button>
        )


        return(
            <Card title={title} extra={extra} >
                <Table
                    dataSource={parentId==='0'? categories : subcategories}
                    columns={this.columns}
                    bordered={true}
                    rowKey={'_id'}
                    loading={loading}
                    pagination={{pageSize:5, showQuickJumper:true, showSizeChanger:true}}
                />

                <Modal
                    title="Add Category"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categories={categories} parentId={parentId} setForm={(form)=>{this.form=form}}/>
                </Modal>

                <Modal
                    title="Update Category"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm={(form)=>{this.form=form}}/>
                </Modal>

            </Card>
        )
    }
}