import {getCourses, getRole} from "../api/courses";
import {Course} from "../type/course";
import {reactive, watch} from 'vue'
import {message} from "ant-design-vue";
import {Role} from "../type/user";
import store from "../store";
import {User} from "../type/user";

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
            course.role = res.role;
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
            course.role = res.role;
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
