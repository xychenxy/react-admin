import React, {Component} from 'react';
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles, reqAddRole, reqUpdateRole} from "../../api";
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {formatDate} from "../../utils/dateUtils";


export default class Role extends Component{

    constructor(props){
        super(props)
        this.auth = React.createRef()
    }


    state = {
        roles : [],
        role: {},
        isShowAdd: false,
        isShowAuth: false
    }

    initColumn = () =>{
        this.columns = [
            {
                title:'Role Name',
                dataIndex: 'name',
            },
            {
                title:'Create Time',
                dataIndex: 'create_time',
                render: (create_time)=>formatDate(create_time)
            },
            {
                title:'Auth Time',
                dataIndex: 'auth_time',
                render: (auth_time)=>formatDate(auth_time)
            },
            {
                title:'Authorised By',
                dataIndex: 'auth_name',
            },
        ]
    }


    onRow = (role) =>{
        return{
            onClick: event =>{
                this.setState({role})
            }
        }
    }

    getRoles = async () =>{
        const result = await reqRoles()
        if(result.status===0){
            const roles = result.data
            this.setState({roles})
        }
    }


    addRole = () =>{
        this.form.validateFields(async (err, values) =>{
            if(!err){
                // 1. hide Modal
                this.setState({isShowAdd:false})

                // 2. collect data and sent request
                const {roleName} = values
                this.form.resetFields()
                const result = await reqAddRole(roleName)

                // 3. handle response
                if(result.status===0){
                    message.success("Add role success!")
                    this.getRoles()
                    // const role = result.data
                    // this.setState(state => ({
                    //     roles:[...state.roles, role]
                    // }))
                }else {
                    message.error("Add role fail!")
                }
            }
        })
    }


    updateRole = async () =>{
        // 1. hide the Modal
        this.setState({
            isShowAuth:false
        })

        // 2. collect data and sent request
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdateRole(role)

        // 3. handle the response
        if (result.status===0) {
            // check if update itself
            if(role._id === memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success("Update authorization success!")
            }else {
                message.success("Update authorization success!")
                this.getRoles()
                // this.setState({
                //     roles:[...this.state.roles]
                // })
            }
        }
    }

    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }

    render(){

        const {roles, role, isShowAdd, isShowAuth} = this.state

        const title = (
            <span>
                <Button type='primary' onClick={()=>{this.setState({isShowAdd: true})}}>Create Role</Button> &nbsp;&nbsp;
                <Button type='primary'
                        disabled={!role._id}
                        onClick={()=>{this.setState({isShowAuth: true})}}
                >Set Role Authorization</Button>
            </span>
        )

        return(
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { 
                            this.setState({
                                role
                            })
                        }

                    }}
                    onRow={this.onRow}
                />

                <Modal
                    title="Add Role"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>


                <Modal
                    title="Set Role Authorization"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>

            </Card>
        )
    }
}