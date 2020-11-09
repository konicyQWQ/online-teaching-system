// 身份信息
export enum Role {
    student, teacher,  administrator, guest
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
export const uploadUrl = 'https://10.181.244.103:5001/api/upload'
export const uploadName = 'files'

//传入图片ID，生成图片路径
export function getFileUrl(id:number):string {
    return `${uploadUrl}?id=${id}`
}