import request from './axios'

export declare interface HomePage {
    id?: number,
    fileId: number,
    url: string
}

/**
 * 获得主页的图片
 */
async function getHomePage() : Promise<HomePage[]> {
    const res = await request.get('system/home');
    return res.data.pages as HomePage[];
}

export {
    getHomePage
}