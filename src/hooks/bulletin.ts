import {Bulletin, getBulletin} from "../api/bulletin";
import {reactive, ref} from 'vue'
import {message} from "ant-design-vue";

interface BulletinState {
    bulletin: Array<Bulletin>,
    loading: boolean
}

interface Bulletin {
    state: BulletinState,
    fetchBulletin: () => void
}

export function useBulletin(courseID): Bulletin {
    const state: BulletinState = reactive({
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

    fetchBulletin();

    return {
        state,
        fetchBulletin
    }
}