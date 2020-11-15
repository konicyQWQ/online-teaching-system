import {AntFileInfo, CoursewareUploadName, CoursewareUploadUrl, File} from "./file";
import {Field} from "./form";

export declare interface Courseware {
    id?: number,
    courseId: number,
    title: string,
    time: Date,
    description: string,
    privilege: number,
    fileList?: Array<number> | Array<File> // fileID的数组 增加，修改需要用, CoursewareFile的数组，get的时候需要用
}

export class CoursewareModel implements Courseware{
    courseId: number;
    description: string;
    fileList: Array<number> | Array<File>;
    id: number;
    privilege: number;
    time: Date;
    title: string;

    constructor({courseId=0, description='', fileList=[], id=0, privilege=0, time=new Date, title=''}: Partial<Courseware> = {}) {
        this.courseId = courseId;
        this.description = description
        this.fileList = fileList
        this.id = id
        this.privilege = privilege
        this.time = time
        this.title = title
    }
}

export const CoursewareTitleField: Field = {
    type: "input",
    label: '标题',
    rule: {
        required: true,
        trigger: "blur"
    }
}

export const CoursewareDescriptionField: Field = {
    type: "textarea",
    label: '说明'
}

export const PrivilegeField: Field = {
    type: "radio",
    label: '权限',
    radios: [{value: 0, hint: '本课程人员可下载'}, {value: 1, hint: '游客可下载'}],
}

export const FileListField: Field = {
    type: "upload",
    label: '附件',
    file: {
        name: CoursewareUploadName,
        multiple: true,
        action: CoursewareUploadUrl
    }
}