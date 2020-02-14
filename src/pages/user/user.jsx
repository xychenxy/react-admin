import React, {Component} from 'react';
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import LinkButton from "../../components/link-button/link-button";
import {formatDate} from "../../utils/dateUtils";
import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";
import UserForm from './user-form'
import {PAGE_SIZE} from "../../utils/constants";

export default class User extends Component{

    state = {
        users:[],
        roles:[],
        isShow:false
    }


    showUpdate = (user) => {
        this.user = user //
        this.setState({
            isShow: true
        })
    }


    deleteUser = (user) => {
        Modal.confirm({
            title: `Are you deleting ${user.username}?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if(result.status===0) {
                    message.success('Delete user success!')
                    this.getUsers()
                }
            }
        })
    }

    showAdd = () =>{
        this.user = null
        this.setState({isShow:true})
    }

    addOrUpdateUser = async () =>{
        // 1. hide Modal
        this.setState({isShow: false})


        // 2. collect data and send request
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        // check if update or add
        if(this.user){
            user._id = this.user._id
        }

        const result = await reqAddOrUpdateUser(user)

        // 3. handle response
        if(result.status===0) {
            message.success(`${this.user ? 'Update' : 'Add'} user success!`)
            this.getUsers()
        }
    }

    /**
     *  Generate an array to save all role name, for render
     * @param roles
     */
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    getUsers = async () =>{
        const result = await reqUsers()
        if (result.status===0) {
            const {users, roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }


    initColumns = () => {
        this.columns = [
            {
                title: 'User Name',
                dataIndex: 'username'
            },
            {
                title: 'Email',
                dataIndex: 'email'
            },

            {
                title: 'Telephone',
                dataIndex: 'phone'
            },
            {
                title: 'Create Time',
                dataIndex: 'create_time',
                render: (create_time) => formatDate(create_time)
            },
            {
                title: 'Role',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: 'Operation',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>Update</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
                    </span>
                )
            },
        ]
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount () {
        this.getUsers()
    }

    render(){

        const {users, roles, isShow} = this.state
        const user = this.user || {}

        const title = (
            <Button type='primary' onClick={this.showAdd}>Create User</Button>
        )

        return(
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                />

                <Modal
                    title={user._id ? 'Update User' : 'Add User'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({isShow: false})
                    }}
                >
                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>

            </Card>
        )
    }
}