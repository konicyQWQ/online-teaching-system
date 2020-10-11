export enum Role { teacher, student, admin, unknown }
export enum Gender { male, female }

export declare interface User {
  id: string,
  name: string,
  gender: Gender,
  grade: number,
  phone: string,
  email: string,
  role: Role,
  avatarID: string
}