<template>
    <two-col :fixed="true">
        <template v-slot:left>
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </template>
        <template v-slot:right>
            <nav-card :tabList="tabList">
                <template v-slot:title>
                    <h3>
                        {{ courses.name }}
                        <a-tooltip>
                            <template v-slot:title>
                                {{ courses.teacher }}
                            </template>
                            <a-avatar style="float: right;" :src="courses.teacherAvatar"></a-avatar>
                        </a-tooltip>
                    </h3>
                </template>
            </nav-card>
        </template>
    </two-col>
</template>

<script>
import twoCol from "../components/two-col.vue";
import navCard from "../components/nav-card.vue"
import { courses } from "../axios/courses.js";
import { reactive, readonly } from 'vue';

export default {
    name: 'courses',
    components: {
        'two-col': twoCol,
        'nav-card': navCard
    },
    setup() {
        const tabList = readonly([
            { key: 'description', name: '课程简介' },
            { key: 'bulletin', name: '公告' },
            { key: 'courseware', name: '课件' },
            { key: 'homework', name: '作业' },
            { key: 'exam', name: '测试' },
            { key: 'forum', name: '讨论' },
            { key: 'score', name: '成绩' }
        ]);

        return { courses, tabList }
    }
}
</script>

<style scoped>

</style>