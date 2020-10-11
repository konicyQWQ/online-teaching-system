import {createWebHistory, createRouter} from 'vue-router'
import index from '../views/index.vue'

const routes = createRouter({
  history: createWebHistory(),
  routes: [
    {
      /** 首页 */
      path: '/',
      component: index
    },
    {
      /** 公开课程 */
      path: '/public',
      component: () => import('../views/public.vue')
    },
    {
      path: '/register',
      component: () => import('../views/register.vue')
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
          name: 'description',
          components: {
            default: () => import('../components/courses/description.vue'),
            extra: () => import('../components/edit/edit-description.vue'),
          }
        },
        {
          /** 公告 */
          path: 'bulletin',
          name: 'bulletin',
          components: {
            default: () => import('../components/courses/bulletin.vue'),
            extra: () => import('../components/edit/edit-bulletin.vue')
          }
        },
        {
          /** 课件 */
          path: 'courseware',
          name: 'courseware',
          component: () => import('../components/courses/courseware.vue')
        },
        {
          /** 作业列表 */
          path: 'homework',
          name: 'homework',
          component: () => import('../components/courses/homework.vue'),
        },
        {
          /** 具体的作业内容，如果是学生显示内容和提交，老师显示表格去批改 */
          path: 'homework/:id',
          component: () => import('../components/courses/content.vue')
        },
        {
          /** 考试 */
          path: 'exam',
          name: 'exam',
          component: () => import('../components/exam.vue')
        },
        {
          /** 讨论 */
          path: 'forum',
          name: 'forum',
          component: () => import('../components/forum.vue')
        },
        {
          /** 成绩，学生显示成绩，老师显示表格登记学生成绩 */
          path: 'score',
          name: 'score',
          component: () => import('../components/score.vue')
        }
      ]
    },
    {
      /** 用户页 */
      path: '/user',
      component: () => import('../views/user.vue'),
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
          name: 'index',
          component: () => import('../components/user/index.vue')
        },
        {
          /** 显示用户自己的课程 */
          path: 'courses',
          name: 'courses',
          component: () => import('../components/user/courses.vue')
        },
        {
          /** 用户的个人资料修改 */
          path: 'setting',
          name: 'setting',
          component: () => import('../components/user/setting.vue')
        }
      ]
    }
  ]
})

export default routes