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
        categories:[],
        subcategories:[],
        parentId:'0',
        parentName:'',
        loading:false,
        showStatus:0 // if showing dialogue, 0 none, 1 show add, 2 show update
    }

    /*

     */
    getCategories = async () =>{
        this.setState({loading:true})
        const {parentId} = this.state
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

    }

    updateCategory = async () =>{
        this.setState({
            showStatus : 0
        })

        const categoryId = this.category._id
        const categoryName = this.form.getFieldValue('categoryName')

        this.form.resetFields()

        const result = await reqUpdateCategory(categoryId, categoryName)

        if(result.status===0){
            this.getCategories()
            message.success('Update Success');
        }else {
            message.error('Update Fail');
        }

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
                    <AddForm/>
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