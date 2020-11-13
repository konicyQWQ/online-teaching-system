export enum Gender { male, female }
export enum Role { student, teacher,  administrator, guest, assistant }

export declare interface User {
    id: string,
    name: string,
    gender: Gender,
    grade: number,
    phone: string,
    email: string,
    role: Role,
    avatarId: number,
    introduction: string
}

export const notGuest = (role: Role) => role != Role.guest
export const notGuestAndStudent = (role: Role) => role != Role.guest && role != Role.student
export const isStudent = (role:Role) => role === Role.student