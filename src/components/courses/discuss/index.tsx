import { defineComponent, reactive } from 'vue'
import { Card, Button } from 'ant-design-vue'

// 写JSX
export default defineComponent(((props, ctx) => {
    // reactive定义数据
    const state = reactive({
        data: 1
    })

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