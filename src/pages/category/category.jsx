import React, {Component} from 'react';
import {
    Card,
    Table,
    Button,
    Icon
} from 'antd'
import './category.less'
import LinkButton from "../../components/link-button/link-button";

export default class Category extends Component{




    render(){

        const title = 'Level 1 category'
        const extra = (
            <Button type='primary'>
                <Icon type='plus'></Icon>
                Add
            </Button>
        )


        const dataSource = [
            {
                'parentId':"0",
                '_id':"sdfsfds",
                'name':"Home Appliance",
                '_v':0,
            },
            {
                'parentId':"0",
                '_id':"sdfsfdss",
                'name':"Computer",
                '_v':0,
            },
        ];

        const columns = [
            {
                title: 'Category Name',
                dataIndex: 'name',
            },
            {
                title: 'Operation',
                render: ()=>(
                    <span>
                        <LinkButton>Modify</LinkButton>
                        <LinkButton>Subcategory</LinkButton>
                    </span>
                )
            },
        ];


        return(
            <Card title={title} extra={extra} >
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered={true}
                    rowKey={'_id'}
                />;
            </Card>
        )
    }
}