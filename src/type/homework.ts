import {CoursewareUploadName, CoursewareUploadUrl, File} from "./file";
import {User} from "./user";
import {Field} from "./form";
import {HomeworkUploadData} from "./file";

export enum HomeworkStatus {
    pending, active, nearDDL, finished
}

export enum HomeworkType {
    individual, group
}

export declare interface Homework {
    hwId: number,
    courseId: string,
    title: string,
    startTime: Date,
    endTime: Date,
    content: string,
    totalMark: number,
    percentage: number,
    status: HomeworkStatus,
    type: HomeworkType
}

export const HWTypeField: Field = {
    type: "radio",
    label: '类型',
    radios: [
        {value: HomeworkType.individual, hint: '个人作业'},
        {value: HomeworkType.group, hint: '小组作业'}
    ],
}

export const HWTitleField: Field = {
    type: 'input',
    label: '标题',
    rule: {
        required: true,
        message: '标题必须填写',
        trigger: "blur"
    }
}

export const HWContentField: Field = {
    type: 'textarea',
    label: '描述'
}

export const TotalMarkField: Field = {
    type: 'number',
    label: '总分',
    min: 0,
    max: 999
}

export const PercentageField: Field = {
    type: 'number',
    label: '占比',
    min: 0,
    max: 100
}

export const HomeworkFileField: Field = {
    type: 'upload',
    label: '附件',
    file: {
        multiple: true,
        name: CoursewareUploadName,
        action: CoursewareUploadUrl,
    }
}

export declare interface UserHomework {
    userId: number,
    hwId: number,
    description: string,
    mark: number,
    comment: string
}

export const CommentField: Field = {
    label: '评语',
    type: 'textarea'
}

export declare interface HomeworkWithFiles {
    homework: Homework,
    files: File[]
}

export declare interface Statistics {
    totalCount: number,
    submitCount: number,
    scoredCount: number
}

export declare interface UserHomeworkWithFiles {
    userInfo: User,
    userHomework: Homework,
    files: File[]
}

export declare interface HomeworkDetail {
    homework: HomeworkWithFiles,
    statistics: Statistics,
    StuHomeworkList: UserHomeworkWithFiles,
}

export declare interface StudentHomeworkOverview {
    homework: Homework,
    userHomework: Homework
}