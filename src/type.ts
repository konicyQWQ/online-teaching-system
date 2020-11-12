import {message} from "ant-design-vue";

export const apiURL = 'https://10.181.151.50:5001/api';
export const staticUrl = 'https://10.181.151.50:5001'

export enum Role {
    student, teacher,  administrator, guest, assistant
}

export enum Gender {
    male, female
}

export enum CoursesStatus {
    pending, open, closed
}

// 用户默认头像ID
export const defaultUserAvatar = null

//文件上传URL
export const uploadUrl = `${apiURL}/upload`
export const uploadName = 'files'

//传入图片ID，生成图片路径
export function getFileUrl(id:number, type: string = 'course'):string {
    if(id === 0 || !id) {
        if(type === 'course')
            return `${staticUrl}/pic/main.jpg`
        else if(type === 'user') {
            return `${staticUrl}/pic/user.png`
        }
    }
    return `${uploadUrl}?id=${id}`
}

// 检查是否是图片的API
export function checkImg(file) {
    const isImage =  /image\/.*/.test(file.type);
    if(!isImage) {
        message.error('只能上传图片!')
    }
    const isLt2m = file.size / 1024 / 1024 < 2;
    if(!isLt2m) {
        message.error('大小超过限制(2MB)!');
    }
    return isImage && isLt2m;
}