import React, {Component} from 'react';
import LinkButton from "../../components/link-button/link-button";
import {BASE_IMG_URL} from "../../utils/constants";
import {reqCategory} from "../../api";
import {
    Card,
    Icon,
    List
} from 'antd'

const Item = List.Item

export default class ProductDetail extends Component{

    state = {
        cName1:'', // category level 1
        cName2:'', // category level 2
    }

    async componentDidMount () {


        const {pCategoryId, categoryId} = this.props.location.state.product
        if(pCategoryId==='0') { // level 1 products
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else { // level 2 products
            /*
            //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
            const result1 = await reqCategory(pCategoryId) // 获取一级分类列表
            const result2 = await reqCategory(categoryId) // 获取二级分类
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            */

            // 一次性发送多个请求, 只有都成功了, 才正常处理
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }

    }

    render(){

        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1, cName2} = this.state

        const title = (
            <span>
                <LinkButton>
                  <Icon
                      type='arrow-left'
                      style={{marginRight: 10, fontSize: 20}}
                      onClick={() => this.props.history.goBack()}
                  />
                </LinkButton>

                <span>Product Details</span>
            </span>
        )

        return(
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className="left">Product Name:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Description:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Price:</span>
                        <span>&{price}</span>
                    </Item>
                    <Item>
                        <span className="left">Category:</span>
                        <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className="left">Product Image:</span>
                        <span>
                          {
                              imgs.map(img => (
                                  <img
                                      key={img}
                                      src={BASE_IMG_URL + img}
                                      className="product-img"
                                      alt="img"
                                  />
                              ))
                          }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">Product Detail:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}