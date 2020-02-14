import React, {PureComponent} from 'react';
import PropTypes from 'prop-types'
import menuList from "../../config/menuConfig";
import {
    Form,
    Input,
    Tree
} from 'antd'

export default class AuthForm extends PureComponent{

    static propTypes = {
        role: PropTypes.object
    }


    constructor(props){
        super(props)

        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    getMenus = () => this.state.checkedKeys

    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    };

    getTreeNodes = (menuList) =>{
        return menuList.map(item => {
            if (!item.children){
                return (
                    <Tree.TreeNode title={item.title} key={item.key}>
                    </Tree.TreeNode>
                )
            }else {
                return (
                    <Tree.TreeNode title={item.title} key={item.key}>
                        {this.getTreeNodes(item.children)}
                    </Tree.TreeNode>
                )
            }
        })
    }


    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    render(){

        const {role} = this.props
        const {checkedKeys} = this.state

        const formItemLayout = {
            labelCol: { span: 6 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }

        return(
            <div>
                <Form>

                    <Form.Item label="Role's Name" {...formItemLayout}>
                        <Input value={role.name} disabled/>
                    </Form.Item>

                </Form>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <Tree.TreeNode title="Authorization" key="all">
                        {this.treeNodes}
                    </Tree.TreeNode>
                </Tree>
            </div>

        )
    }
}

