 import React, {Component} from 'react';
 import LinkButton from "../../components/link-button/link-button";
 import {reqProducts, reqSearchProducts, reqAddOrUpdateProduct} from "../../api";

 import {PAGE_SIZE} from "../../utils/constants";
 import {
     Card,
     Select,
     Input,
     Button,
     Icon,
     Table,
     message
 } from 'antd'

 const Option = Select.Option

 export default class ProductHome extends Component{

     state = {
         products:[],
         loading: false,
         total: 0, // products total number
         searchName: '', // the search key words
         searchType: 'productName', // productName is default
     }

     initColumns = () => {
         this.columns = [
             {
                 title: 'Product Name',
                 dataIndex: 'name',
             },
             {
                 title: 'Product Description',
                 dataIndex: 'desc',
             },
             {
                 title: 'Price',
                 dataIndex: 'price',
                 render: (price) => '$' + price
             },
             {
                 width: 100,
                 title: 'Status',
                 // dataIndex: 'status',
                 render: (product) => {
                     const {status, _id} = product
                     const newStatus = status===1 ? 2 : 1
                     return (
                         <span>
                              <Button
                                  type='primary'
                                  onClick={() => this.updateStatus(_id, newStatus)}
                              >
                                {status===1 ? '下架' : '上架'}
                              </Button>
                              <span>{status===1 ? '在售' : '已下架'}</span>
                        </span>
                     )
                 }
             },
             {
                 width: 100,
                 title: 'Operation',
                 render: (product) => {
                     return (
                         <span>
                            {/*将product对象使用state传递给目标路由组件*/}
                             <LinkButton
                                 onClick={() => this.props.history.push('/product/detail', {product})}>Detail</LinkButton>
                            <LinkButton
                                onClick={() => this.props.history.push('/product/addupdate', product)}>Update</LinkButton>
                        </span>
                     )
                 }
             },
         ];
     }

     getProducts = async (pageNum) => {
         let result
         this.setState({loading: true})
         const {searchName, searchType} = this.state
         if(searchName){
             result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchName, searchType})
         }else {
             result = await reqProducts(pageNum, PAGE_SIZE)
         }
         this.setState({loading: false})

         if(result.status===0){
             const {total, list} = result.data
             this.setState({
                 total:total,
                 products:list
             })
         }
     }

     componentWillMount() {
         this.initColumns()
     }

     componentDidMount() {
        this.getProducts(1)
     }


     render(){

         const {products, total, loading, searchType, searchName} = this.state

         const title = (
             <span>
                <Select
                    value = {searchType}
                    style={{width:200}}
                    onChange={value => this.setState({searchType: value})}
                >
                    <Option value='productName'>Search by name</Option>
                    <Option value='productDesc'>Search by description</Option>
                </Select>
                 <Input
                     style={{width: 180, marginLeft: 10, marginRight: 10}}
                     placeholder='key words'
                     onChange={(event) => this.setState({searchName: event.target.value})}
                 />
                 <Button type='primary' onClick={() => this.getProducts(1)}>Search</Button>
             </span>
         )

         const extra = (
             <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                 <Icon type='plus'/>
                 Add Products
             </Button>
         )

         return(
             <Card title={title} extra={extra}>
                 <Table
                     bordered
                     rowKey='_id'
                     loading={loading}
                     dataSource={products}
                     columns={this.columns}
                     pagination={{
                         // current: this.pageNum,
                         total: total,
                         defaultPageSize: PAGE_SIZE,
                         showQuickJumper: true,
                         onChange: this.getProducts
                     }}
                 />
             </Card>
         )
     }
 }