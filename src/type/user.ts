import { Field } from "./form";

export enum Gender { male, female }

export enum Role { guest, student, assistant, teacher, administrator }

export declare interface User {
    id: string,
    password?: string,
    name: string,
    gender?: Gender,
    grade?: number,
    phone?: string,
    email?: string,
    role?: Role,
    avatarId?: number,
    introduction?: string,
    department?: string
}

export const DepartmentField: Field = {
    type: 'select',
    label: '院系',
    rule: {
        required: true,
        trigger: "blur"
    },
    select: ['计算机科学与技术学院', '体育学院', '信息与电子工程学院', '艺术学院', '管理学院', '经济学院']
}
export const EmailField: Field = {
    type: 'autocomplete',
    label: '邮箱',
    autoComplete: {
        handleSearch: (data, now: string) => {
            let str = now.split('@')[0];
            let searchArray = ['@163.com', '@qq.com', '@zju.edu.cn'].map(value => str + value)
            data.acList = searchArray.filter(value => value.includes(now))
        }
    },
    rule: {
        required: true,
        validator: (rule, value) => {
            if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value) === false)
                return Promise.reject('邮箱格式错误!')
            return Promise.resolve('')
        },
        trigger: 'blur'
    }
}
export const IdField: Field = {
    type: 'input',
    label: '学号',
    rule: {
        required: true,
        trigger: "blur",
        validator: (rule, value) => {
            if (/^\d{10}$/.test(value) === false)
                return Promise.reject('学号必须为10位!')
            return Promise.resolve('')
        }
    }
}
export const NameField: Field = {
    type: "input",
    label: '姓名',
    rule: {
        required: true,
        trigger: "blur"
    }
}
export const PhoneField: Field = {
    type: "input",
    label: '手机',
    rule: {
        required: true,
        validator: (rule, value) => {
            if (/^\d{11}$/.test(value) === false)
                return Promise.reject('手机格式错误!')
            return Promise.resolve('')
        },
        trigger: 'blur'
    }
}
export const GenderField: Field = {
    type: "radio",
    label: '性别',
    radios: [{ value: Gender.male, hint: '男' }, { value: Gender.female, hint: '女' }]
}
export const GradeField: Field = {
    type: "number",
    label: '年级',
    min: 1,
    max: 4
}
export const IntroductionField: Field = {
    type: "textarea",
    label: '个人简介'
}
export const PasswordField: Field = {
    type: "password",
    label: '密码',
    rule: {
        required: true,
        trigger: "blur"
    }
}
export const RoleField: Field = {
    type: 'radio',
    label: '身份',
    radios: [
        { value: Role.student, hint: '学生' },
        { value: Role.teacher, hint: '老师' },
        { value: Role.administrator, hint: '管理员' }
    ]
}

export const notGuest = (role: Role) => role != Role.guest
export const notGuestAndStudent = (role: Role) => role != Role.guest && role != Role.student
export const isStudent = (role: Role) => role === Role.student
export const isAdmin = (role: Role) => role == Role.administrator