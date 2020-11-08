import { defineComponent, reactive } from 'vue'
import { Card, Button } from 'ant-design-vue'

import { useRouter } from "vue-router";
import { useStore } from "vuex";

// 写JSX
export default defineComponent(((props, ctx) => {
    // reactive定义数据
    const state = reactive({
        data: 1
    })

    const router = useRouter()
    // router.push('/xxx/xxx') 进入/xxx/xxx路由
    // router.back() 回退

    const store = useStore()
    // store.state.token 目前登录用户的token
    // store.state.avatarId 目前登录用户的头像ID
    // store.state.role 登录用户的身份(跟课程不是对应关系的)
    // store.state.name 登录用户的姓名

    function changeData() {
        state.data ++;
    }


    return () => (
        <Card>
            {state.data}
            <Button type={'primary'} onClick={changeData}>123</Button>
        </Card>
    )
}))