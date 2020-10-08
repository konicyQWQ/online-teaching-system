import request from "./index.js"
import { reactive } from 'vue'

let allCourses = reactive([
    {
        name: '程序设计方法学',
        image: 'https://courses.zju.edu.cn/api/uploads/2230483/modified-image?thumbnail=700x380',
        teacher: '翁恺',
        id: 1
    },
    {
        name: '自然辩证法概论',
        image: 'https://courses.zju.edu.cn/api/uploads/2230483/modified-image?thumbnail=700x380',
        teacher: '翁恺',
        id: 2
    },
    {
        name: 'Java语言',
        image: 'https://courses.zju.edu.cn/api/uploads/2230483/modified-image?thumbnail=700x380',
        teacher: '翁恺',
        id: 3
    }
])

let courses = reactive({
    id: 1,
    name: '程序设计方法学',
    teacher: '翁恺',
    teacherAvatar: 'https://courses.zju.edu.cn/api/uploads/2194/modified-image?thumbnail=32x32&crop_box=48,199,2013,2164'
})

async function getAllCourses() {
    // const xxx = await request()
}

async function getCourses() {
    // const xxx = await request()
}

export {
    getAllCourses,
    allCourses,
    getCourses,
    courses,
}