import { createRouter, createWebHistory } from "vue-router";
import index from '../views/index.vue'
import { Role } from "../type";
import store from "../store";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: index,
        },
        {
            path: '/public',
            component: () => import('../views/public.vue')
        },
        {
            path: '/help',
            component: () => import('../views/help.vue')
        },
        {
            path: '/register',
            component: () => import('../views/register.vue')
        },
        {
            path: '/forget-password',
            component: () => import('../views/forget-password.vue')
        },
        {
            /** 课程页, id 是课程编号 */
            path: '/courses/:id',
            component: () => import('../views/courses.vue'),
            children: [
                {
                    /** 默认页面去显示课程简介 */
                    path: '',
                    redirect: to => {
                        return to.path + '/description'
                    }
                },
                {
                    /** 课程简介 */
                    path: 'description',
                    components: {
                        default: () => import('../components/courses/description.vue'),
                    }
                },
                {
                    /** 公告 */
                    path: 'bulletin',
                    components: {
                        default: () => import('../components/courses/bulletin.vue'),
                    }
                },
                {
                    /** 课件 */
                    path: 'courseware',
                    component: () => import('../components/courses/courseware.vue')
                },
                {
                    /** 作业列表 */
                    path: 'homework',
                    component: () => import('../components/courses/homework.vue'),
                },
                {
                    /** 具体的作业内容，如果是学生显示内容和提交，老师显示表格去批改 */
                    path: 'homework/:homeworkId',
                    component: () => import('../components/courses/content.vue')
                },
                {
                    /** 考试 */
                    path: 'exam',
                    component: () => import('../components/exam.vue')
                },
                {
                    /** 讨论 */
                    path: 'discuss',
                    component: () => import('../components/courses/discuss/index.vue')
                },
                {
                    path: 'discuss/:discussId',
                    component: () => import('../components/courses/discuss/page.vue')
                },
                {
                    /** 成绩，学生显示成绩，老师显示表格登记学生成绩 */
                    path: 'score',
                    component: () => import('../components/score.vue')
                }
            ]
        },
        {
            /** 用户页 */
            path: '/user',
            component: () => import('../views/user.vue'),
            meta: {
                // 只有这三类用户可以访问这个页面
                auth: [Role.student, Role.administrator, Role.teacher]
            },
            children: [
                {
                    /** 用户首页 */
                    path: '',
                    redirect: to => {
                        return to.path + '/index'
                    }
                },
                {
                    /** 用户首页，显示课程的最新公告，未交的作业 */
                    path: 'index',
                    component: () => import('../components/user/index.vue')
                }
            ]
        },
        {
            /** 教师展示页 */
            path: '/teacher/:id',
            component: () => import('../views/teacher.vue')
        },
        {
            /** 404页面 */
            path: '/:pathMatch(.*)*',
            component: () => import('../views/404.vue')
        },
        {
            path: '/403',
            component: () => import('../views/403.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    if(to.meta.auth === undefined || to.meta.auth.indexOf(store.state.role) !== -1) {
        next()
    } else {
        // 没有权限
        next('/403')
    }
})

export default router;