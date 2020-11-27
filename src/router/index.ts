import { createRouter, createWebHistory } from "vue-router";
import index from '../views/index.vue'
import { Role } from "../type/user";
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
            /** 课程页, cid 是课程编号 */
            path: '/courses/:cid',
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
                    name: 'description',
                    components: {
                        default: () => import('../components/courses/description.vue'),
                        extra: () => import('../components/courses/edit/description.vue')
                    }
                },
                {
                    /** 公告 */
                    path: 'bulletin',
                    name: 'bulletin',
                    components: {
                        default: () => import('../components/courses/bulletin.vue'),
                        extra: () => import('../components/courses/edit/bulletin.vue')
                    }
                },
                {
                    /** 课件 */
                    path: 'courseware',
                    name: 'courseware',
                    components: {
                        default : () => import('../components/courses/courseware.vue'),
                        extra: () => import('../components/courses/edit/courseware.vue')
                    }
                },
                {
                    /** 作业列表 */
                    path: 'homework',
                    components: {
                        default: () => import('../components/courses/homeworkParentNode.vue'),
                        extra: () => import('../components/courses/homeworkExtraParentNode.vue')
                    },
                    children: [
                        {
                            path: '',
                            name: 'homework',
                            components: {
                                default : () => import('../components/courses/homework.vue'),
                                extra: () => import('../components/courses/edit/homework.vue')
                            },
                        },
                        {
                            path: ':hwID',
                            components: {
                                default: () => import('../components/courses/content.vue'),
                                extra: () => import('../components/courses/edit/content.vue')
                            }
                        }
                    ]
                },
                {
                    /** 考试 */
                    path: 'exam',
                    components: {
                        default: () => import('../components/courses/examPN.vue'),
                        extra: () => import('../components/courses/examExtraPN.vue')
                    },
                    children: [
                        {
                            path: '',
                            name: 'exam',
                            components: {
                                default: () => import('../components/courses/exam.vue'),
                                extra: () => import('../components/courses/edit/exam.vue')
                            },
                        },
                        {
                            path: ':examId',
                            components: {
                                default: () => import('../components/courses/exam/content.vue'),
                                extra: () => import('../components/courses/exam/nav.vue')
                            }
                        }
                    ]
                },
                {
                    /** 讨论 */
                    path: 'discuss',
                    name: 'discuss',
                    component: () => import('../components/courses/discuss/index.vue')
                },
                {
                    path: 'discuss/:disId',
                    component: () => import('../components/courses/discuss/page.vue')
                },
                {
                    path: 'studentList',
                    name: 'studentList',
                    component: () => import('../components/courses/studentList.vue')
                },
                {
                    path: 'group',
                    name: 'group',
                    component: () => import('../components/courses/group.vue')
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
                },
                {
                    path: 'resetPassword',
                    component: () => import('../components/user/resetPassword.vue')
                },
                {
                    path: 'information',
                    component: () => import('../components/user/information.vue')
                },
                {
                    path: 'myCourses',
                    component: () => import('../components/user/myCourses.vue')
                }
            ]
        },
        {
            path: '/administrator',
            component: () => import('../views/administrator.vue'),
            meta: {
                auth: [Role.administrator]
            },
            children: [
                {
                    path: '',
                    redirect: to => {
                        return to.path + '/courses'
                    }
                },
                {
                    path: 'users',
                    component: () => import('../components/administrator/users.vue')
                },
                {
                    path: 'courses',
                    component: () => import('../components/administrator/courses.vue')
                },
                {
                    path: 'other',
                    component: () => import('../components/administrator/other.vue')
                }
            ]
        },
        {
            /** 教师展示页 */
            path: '/teacher/:id',
            // path: '/teacher',
            component: () => import('../views/teacher.vue'),
            children: [
                {
                    /** 教师展示页首页 */
                    path: '',
                    redirect: to => {
                        return to.path + '/index'
                    }
                },
                {
                    /** 教师展示页*/
                    path: 'index',
                    component: () => import('../components/teachers/index.vue')
                },
                {
                    /** 教师开设课程页*/
                    path: 'courses',
                    component: () => import('../components/teachers/courses.vue')
                }
            ]    
        },
        {
            path: '/exam/edit',
            component: () => import('../components/exam/edit.vue')
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