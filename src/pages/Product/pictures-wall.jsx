import React, {Component} from 'react';
import {PropTypes} from 'prop-types'
import {
    Upload,
    Icon,
    Modal,
    message
} from 'antd';
import {reqDeleteImg} from "../../api";
import {BASE_IMG_URL} from "../../utils/constants";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {

    static propTypes = {
        imgs:PropTypes.array
    }

    constructor(props){
        super(props)

        let fileList = []
        const {imgs} = this.props
        if(imgs && imgs.length>0){
            fileList = imgs.map((img, index) =>({
                uid : -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }

        this.state = {
            previewVisible: false, // show large image
            previewImage: '', // large image address
            fileList
        }
    }

    state = {
        previewVisible: false, // show large image
        previewImage: '', // large image address
        fileList: [], // all have uploaded file
    };

    // hide Modal
    handleCancel = () => this.setState({ previewVisible: false });


    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };


    getImgs = () =>{
        return this.state.fileList.map(file => file.name)
    }


    /*
        handle upload and remove event
     */
    handleChange = async ({ file, fileList }) => {
        // file is current operated image

        if (file.status === 'done'){
            const result = file.response
            if(result.status === 0){
                message.success("Upload file success!")
                const {name, url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            }else {
                message.error("Upload file fail!")
            }
        }else if(file.status === 'removed'){
            const result = await reqDeleteImg(file.name)
            if(result.status===0){
                message.success("Delete file success!")
            }else {
                message.error("Delete file fail!")
            }
        }

        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    accept="image/*"
                    name="image"
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

