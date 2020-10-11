<template>
    <header>
        <navigation />
    </header>
    <main>
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </main>
    <footer>
        <m-footer />
    </footer>
</template>

<script>
import footer from './components/footer.vue'
import navigation from './components/navigation.vue'

export default {
  name: 'App',
  components: { 'm-footer': footer, navigation }
}
</script>

<style scoped>
header {
    height: 200px;
    background: url("/header.png") no-repeat top/cover;
}

main {
    padding-bottom: 2em;
    min-height: 600px;
    background: linear-gradient(to bottom right, #F6F6F6, #F8F8F8);
}

footer {
    background: linear-gradient(to bottom right, #fff, #fefefe);
}
</style>