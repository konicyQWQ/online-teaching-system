import request from "../api/axios";
import { reactive, ref, Ref } from 'vue'
import {Courses, getAllCourses} from "../api/courses";
import {message} from "ant-design-vue";
import {User} from "../api/user";

interface OneCourses {
    course: Courses,
    teachers: Array<User>
}

interface AllCourses {
    state: Ref<Array<OneCourses>>,
    loading: Ref<boolean>
}

export function useAllCoursesState() : AllCourses {
    const state : Ref<Array<Courses>> = ref([])
    const loading = ref(true);

    getAllCourses({limit: 1000})
        .then(res => {
            state.value = res.resList;
            loading.value = false
        })
        .catch(e => {
            message.error(e);
        })

    return {
        state,
        loading
    }
}