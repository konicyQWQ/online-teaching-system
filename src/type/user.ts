import {Field} from "./form";

export enum Gender { male, female }
export enum Role { student, teacher, administrator, guest, assistant }

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
    introduction?: string
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
            if(/^\d{10}$/.test(value) === false)
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
            if(/^\d{11}$/.test(value) === false)
                return Promise.reject('手机格式错误!')
            return Promise.resolve('')
        },
        trigger: 'blur'
    }
}
export const GenderField: Field = {
    type: "radio",
    label: '性别',
    radios: [{value: Gender.male, hint: '男'}, {value: Gender.female, hint: '女'}]
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

export const notGuest = (role: Role) => role != Role.guest
export const notGuestAndStudent = (role: Role) => role != Role.guest && role != Role.student
export const isStudent = (role: Role) => role === Role.student