<template>
    <nav :class="['nav', {'nav-active': scrollTop > 0}]">
        <a class="logo"><img src="/logo.png"></a>
        <router-link to="/">学在浙大</router-link>
        <router-link to="/public">公开课程</router-link>
        <router-link to="/help">帮助</router-link>
        <span :style="{ flex: 1 }"></span>
        <router-link to="/login" v-if="true">登录</router-link>
        <a v-if="true">注册</a>
    </nav>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
    name: 'navigation',
    setup() {
        let scrollTop = ref(0)
        onMounted(() => {
            window.addEventListener('scroll', () => {
                scrollTop.value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            })
        })
        return { scrollTop }
    }
}
</script>

<style lang="scss" scoped>
.nav {
    display: flex;
    align-items: center;
    padding: 0 10em;
    position: fixed;
    left: 0; right: 0;
    transition: all .3s ease;
    z-index: 10;

    @media screen and (max-width: 800px) {
        padding: 0;
    }

    a {
        line-height: 50px;
        padding: 0 1em;
        border: 3px solid transparent;
        color: white;
        transition: all .3s ease;

        &:hover {
            background: var(--hover-background);
            border-top-color: var(--hover-color);
        }

        &.router-link-active, &.router-link-exact-active {
            border-top-color: var(--choose-color);
        }

        &.logo {
            padding: 0;

            img {
                width: 0;
                height: 50px;
                opacity: 0;
                transition: all .3s ease;
            }
        }
    }

    &:hover, &.nav-active {
        background: #fff;
        box-shadow: var(--shadow);

        a {
            color: #333;
        }
    }

    &.nav-active {
        a.logo {
            padding: 0 1em;

            img {
                width: 50px;
                opacity: 1;
            }
        }
    }
}
</style>