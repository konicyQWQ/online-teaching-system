import { createWebHistory, createRouter } from 'vue-router'
import index from '../views/index.vue'

const historyMode = createWebHistory()
const routes = createRouter({
    history: historyMode,
    routes: [
        {
            path: '/',
            component: index
        },
        {
            /** 课程页, id 是课程编号 */
            path: '/courses/:id',
            component: () => import('../views/courses.vue'),
            children: [
                {
                    /** 默认页面去显示课程简介 */
                    path: '',
                    component: () => import('../components/description.vue')
                },
                {
                    /** 课程简介 */
                    path: 'description',
                    component: () => import('../components/description.vue')
                },
                {
                    /** 公告 */
                    path: 'bulletin',
                    component: () => import('../components/bulletin.vue')
                },
                {
                    /** 课件 */
                    path: 'courseware',
                    component: () => import('../components/courseware.vue')
                },
                {
                    /** 作业列表 */
                    path: 'homework',
                    component: () => import('../components/homework.vue'),
                    children: [
                        {
                            /** 具体的作业内容，如果是学生显示内容和提交，老师显示表格去批改 */
                            path: ':id',
                            component: () => import('../components/content.vue')
                        },
                    ]
                },
                {
                    /** 考试 */
                    path: 'exam',
                    component: () => import('../components/exam.vue')
                },
                {
                    /** 讨论 */
                    path: 'forum',
                    component: () => import('../components/forum.vue')
                },
                {
                    /** 成绩，学生显示成绩，老师显示表格登记学生成绩 */
                    path: 'score',
                    component: () => import('../components/score.vue')
                }
            ]
        },
        {
            /** 登录页 */
            path: '/login',
            component: () => import('../views/login.vue'),
        },
        {
            /** 公开课 */
            path: '/public',
            component: () => import('../views/public.vue')
        },
        {
            /** 帮助 */
            path: '/help',
            component: () => import('../views/help.vue')
        },
        {
            /** 用户页 */
            path: '/user',
            component: () => import('../views/user.vue'),
            children: [
                {
                    /** 用户首页 */
                    path: '',
                    component: () => import('../components/index.vue')
                },
                {
                    /** 用户首页，显示课程的最新公告，未交的作业 */
                    path: 'index',
                    component: () => import('../components/index.vue')
                },
                {
                    /** 显示用户自己的课程 */
                    path: 'courses',
                    component: () => import('../components/courses.vue')
                },
                {
                    /** 用户的个人资料修改 */
                    path: 'setting',
                    component: () => import('../components/setting.vue')
                }
            ]
        }
    ]
})

export default routes