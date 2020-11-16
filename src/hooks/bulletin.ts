import {getBulletin} from "../api/bulletin";
import {reactive} from 'vue'
import {message} from "ant-design-vue";
import {Bulletin} from "../type/bulletin";

interface BulletinState {
    state: {
        bulletin: Array<Bulletin>,
        loading: boolean
    },
    fetchBulletin: () => void
}

export function useBulletin(courseID): BulletinState {
    const state = reactive({
        bulletin: [],
        loading: true
    })

    function fetchBulletin() {
        state.loading = true
        getBulletin({courseID})
            .then(res => {
                state.bulletin = res
                state.loading = false
            })
            .catch(e => {
                message.error(e);
            })
    }

    // fetchBulletin();

    return {
        state,
        fetchBulletin
    }
}