import React, {Component} from 'react';
import {Card, Button} from 'antd'
import ReactEcharts from "echarts-for-react";

export default class Bar extends Component{

    state = {
        sales:[5, 20, 36, 10, 10, 20],
        inventory:[150, 300, 460, 200, 200, 400]
    }


    getOption = (sales, inventory) =>{
        return {
            title: {
                text: 'ECharts Example'
            },
            tooltip: {},
            legend: {
                data:['Sales', 'Inventory']
            },
            xAxis: {
                data: ["shirt","cardign","chiffon shirt","pants","heels","socks"]
            },
            yAxis: {},
            series: [
                {
                    name: 'Sales',
                    type: 'bar',
                    data: sales
                },
                {
                    name: 'Inventory',
                    type: 'bar',
                    data: inventory
                }
            ]
        }
    }

    update = () =>{
        const sales = this.state.sales.map(sale=>sale+10)
        const inventory = this.state.inventory.map(inventory => inventory-10)
        this.setState({sales,inventory})
    }




    render(){
        const {sales, inventory} = this.state
        return(
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>Update</Button>
                </Card>
                <Card title='Bar Chart'>
                    <ReactEcharts type='primary' option={this.getOption(sales,inventory)} style={{height:300}}/>
                </Card>
            </div>
        )
    }
}