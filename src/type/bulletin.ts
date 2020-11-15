import {Field} from "./form";

export declare interface Bulletin {
    bulletinId?: number,
    courseId: number,
    time: Date,
    title: string,
    content: string
}

export class BulletinModel implements Bulletin {
    constructor({courseId=0, bulletinId=0, time=new Date, title='', content=''}: Partial<Bulletin> = {}) {
        this.bulletinId = bulletinId;
        this.courseId = courseId;
        this.time = time
        this.title = title
        this.content = content
    }

    bulletinId: number;
    content: string;
    courseId: number;
    time: Date;
    title: string;
}

export const BulletinContentField: Field = {
    type: 'textarea',
    label: '内容',
    rule: {
        required: true,
        trigger: "blur"
    }
}

export const BulletinTitleField: Field = {
    type: "input",
    label: '标题',
    rule: {
        required: true,
        trigger: "blur"
    }
}
