import {Role, User} from "./user";
import {Field} from "./form";

export enum CourseStatus { pending, open, closed }

export declare interface Course {
    id?: number, // 课程名
    name?: string, // 课程名
    institute?: string, //开课学院
    status?: CourseStatus, //开课状态
    year?: number, //开课学年
    startTime?: Date, //开课时间
    description?: string, //简介
    scoringMethod?: string, //评分方式
    textbook?: string, // 教科书
    iconId?: number,
}

export const CourseNameField:Field = {
    type: "input",
    label: '课程名称',
    rule: {
        required: true,
        trigger: "blur"
    }
}
export const InstituteField:Field = {
    type: "select",
    label: '开课院系',
    rule: {
        required: true,
        trigger: "blur"
    },
    select: ['计算机科学与技术学院', '体育学院', '信息与电子工程学院', '艺术学院', '管理学院', '经济学院']
}
export const StatusField:Field = {
    type: 'radio',
    label: '开课状态',
    radios: [{value: CourseStatus.pending, hint: '未开课'}, {value: CourseStatus.closed, hint: '已结束'}, {value: CourseStatus.open, hint: '开课'}]
}
export const YearField: Field = {
    type: "number",
    label: '开课学年',
    min: 2020,
    max: 2030
}
export const StartTimeField: Field = {
    type: 'time',
    label: '开课时间',
    rule: {
        validator: (rule, value) => {
            if(!value)
                return Promise.reject('时间不能为空')
            return Promise.resolve('')
        },
        trigger: "blur"
    }
}
export const CourseDescriptionField: Field = {
    type: "textarea",
    label: '课程简介',
    rule: {
        required: true,
        trigger: "blur"
    }
}
export const ScoringMethodField: Field = {
    type: "textarea",
    label: '评分方式',
    rule: {
        required: true,
        trigger: "blur"
    }
}
export const TextBookField: Field = {
    type: "textarea",
    label: '课程教材',
    rule: {
        required: true,
        trigger: "blur"
    }
}
export const IconIdField: Field = {
    type: 'avatar',
    label: '课程图片',
    file: {

    }
}
export const TeachersSearchField: Field = {
    type: 'search',
    label: '教师',
    search: {
        placeholder: '输入名字来搜索教师',
        role: Role.teacher
    },
    rule: {
        trigger: "blur",
        validator: async (rule, value) => {
            if(value.length === 0)
                return Promise.reject('至少选择一位老师')
            return Promise.resolve('')
        }
    }
}

export declare interface CourseWithTeachers {
    course: Course,
    teachers: Array<User>
}

export declare interface UserCourse {
    courseList: Array<CourseWithTeachers>,
    teachList: Array<CourseWithTeachers>,
    assistList: Array<CourseWithTeachers>
}