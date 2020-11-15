import {getCourses, getRole} from "../api/courses";
import {Course} from "../type/course";
import {reactive, watch} from 'vue'
import {message} from "ant-design-vue";
import {Role, User} from "../type/user";
import store from "../store";

interface CoursesInfo {
    course: Course,
    teachers: Array<User>,
    role: Role,
    loading: boolean
}

interface CourseState {
    course: CoursesInfo,
    fetchCourse: () => void
}

function useCourse(id: number): CourseState {
    const course = reactive({
        teachers: [],
        course: {},
        role: Role.guest,
        loading: true
    })

    watch(() => store.state.token, () => {
        getRole({id}).then(res => {
            course.role = res;
        }).catch(e => {
            course.role = Role.guest
        })
    })

    function fetchCourse() {
        course.loading = true

        getCourses({id}).then(res => {
            course.course = res.course
            course.teachers = res.teachers
            course.loading = false
        }).catch(e => {
            message.error(e);
        })

        getRole({id}).then(res => {
            course.role = res;
        }).catch(e => {
            course.role = Role.guest
        })
    }

    fetchCourse()

    return {
        course,
        fetchCourse
    }
}

export {
    useCourse
}
