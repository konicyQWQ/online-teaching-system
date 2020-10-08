<template>
    <two-col :right="false">
        <template v-slot:left>
            <a-card class="ant-card-shadow" title="登录">
                <a-row type="flex" align="middle">
                    <a-col :span="12">
                        <a-form :model="form" :labelCol="{ span: 4 }" :wrapperCol="{ span: 14 }">
                            <a-form-item label="用户名">
                                <a-input v-model:value="form.username" placeholder="用户名">
                                    <template v-slot:prefix><UserOutlined /></template>
                                </a-input>
                            </a-form-item>
                            <a-form-item label="密码">
                                <a-input-password v-model:value="form.password"  placeholder="密码">
                                    <template v-slot:prefix><LockOutlined /></template>
                                </a-input-password>
                            </a-form-item>
                            <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                                <a-checkbox v-model:checked="form.rememberMe">
                                    记住我
                                </a-checkbox>
                                <a-button style="float: right" type="primary" @click="handleLogin">
                                    登录
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </a-col>
                    <a-col :span="12">

                    </a-col>
                </a-row>
            </a-card>
        </template>
    </two-col>
</template>

<script>
import twoCol from "../components/two-col.vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue"
import { reactive } from "vue"
import { login } from "../axios/user.js";

export default {
    name: 'login',
    components: {
        'two-col': twoCol,
        UserOutlined,
        LockOutlined
    },
    setup() {
        let form = reactive({
            username: '',
            password: '',
            rememberMe: true
        })

        let handleLogin = () => {
            login(form);
        }

        return { form, handleLogin }
    }
}
</script>

<style scoped>

</style>