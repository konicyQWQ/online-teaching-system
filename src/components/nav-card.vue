<template>
    <a-card class="ant-card-shadow" :body-style="{ padding: '.5em 0' }">
        <template v-slot:title>
            <slot name="title"></slot>
        </template>
        <router-link v-for="tab in tabList"
                     :to="{ name: tab.key }"
                     class="tab">
            {{ tab.name }}
        </router-link>
    </a-card>
</template>

<script>
export default {
    name: 'navCard',
    props: ['tabList'],
    mounted() {
        console.log(this.$route.path)
    }
}
</script>

<style scoped lang="scss">
.tab {
    display: block;
    color: #555;
    font-size: 18px;
    font-weight: 300;
    padding: .5em 1em;
    transition: all .3s ease;
    border-left: 3px solid transparent;

    &:hover {
        border-left-color: var(--hover-color);
        background: var(--hover-background);
    }

    &.router-link-active {
        border-left-color: var(--choose-color);
        background: var(--hover-background);
    }
}
</style>