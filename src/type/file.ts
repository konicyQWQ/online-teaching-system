import {APIUrl, ServerHost} from "./setting";
import {message} from "ant-design-vue";
import store from "../store";

/**
 * 上传文件用到的URL和上传时的参数名，以及额外的data
 */

// 静态文件
export const StaticUploadUrl: string = `${APIUrl}/upload`
export const StaticUploadName: string = 'files'

// 课件
export const CoursewareUploadUrl: string = `${APIUrl}/upload/courseware`
export const CoursewareUploadName: string = 'formFiles'
export const CoursewareUploadData = (courseId: number, token: string) => {
    return {courseId, token}
}

// 作业
export const HomeworkUploadUrl: string = `${APIUrl}/upload/homework`
export const HomeworkUploadName: string = 'formFiles'
export const HomeworkUploadData = CoursewareUploadData

// ant-design文件类型
export declare interface AntFileInfo {
    type: string,
    size: number
}

// 与后端确定的文件类型
export declare interface File {
    id: number,
    name: string,
    size: number
}

/**
 * 判断文件类型是否是图片
 * @param file
 */
export function checkImg(file: AntFileInfo): boolean {
    const isImage = /image\/.*/.test(file.type);
    if (!isImage)
        message.error('只能上传图片!');
    return isImage;
}

/**
 * 判断文件大小是否超过限制
 * @param file
 * @param size 大小
 */
export function checkFileSize(file: AntFileInfo, size = 1024 * 2): boolean {
    const isLt = file.size / 1024 / 1024 < size;
    if (!isLt)
        message.error(`大小超过限制(${Math.floor(size / 1024)}MB)!`);
    return isLt;
}

// 下载文件(mode 为 true 则下载)
export enum FileMode { preview, download }

const FileModeToBool = (mode: FileMode) => mode ? true : false; // 这一步转换是必要的

// 下载文件用的地址
export function CoursewareDownloadUrl(coursewareId: number, fileId: number, mode: FileMode = FileMode.preview): string {
    const token = store.state.token
    return `${APIUrl}/upload/courseware?coursewareID=${coursewareId}&fileID=${fileId}&token=${token}&mode=${FileModeToBool(mode)}`
}

export function HomeworkDownloadUrl(hwID: number, fileID: number, mode: FileMode = FileMode.preview): string {
    const token = store.state.token
    return `${APIUrl}/upload/homework?hwID=${hwID}&fileID=${fileID}&token=${token}&mode=${FileModeToBool(mode)}`
}

export function StudentHomeworkDownloadUrl(stuID: number, hwID: number, fileID: number, mode: FileMode = FileMode.preview): string {
    const token = store.state.token
    return `${APIUrl}/upload/homework?stuID=${stuID}&hwID=${hwID}&fileID=${fileID}&token=${token}&mode=${FileModeToBool(mode)}`
}

export function StaticPreviewUrl(id: number, type: string = 'course'): string {
    if (!id) {
        return type === 'course' ? `${ServerHost}/pic/main.jpg`
            : type === 'user' ? `${ServerHost}/pic/user.png`
                : '';
    }
    return `${APIUrl}/upload/?id=${id}`
}