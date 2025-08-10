export interface User {
  userId?:string
  name: string;
  userName: string;
  mobileNumber: string;
  email: string;
  profileImage:string;
  nationalID?:string
  role?:Role
  budget?:string,
  userSize?:number
  maxSize?:number
}
export interface Role
{
  roleName:string
}
export interface updateUser
{
  name?: string;
  userName?: string;
  mobileNumber?: string;
  email?: string;
}
export interface Password
{
   oldPassword:string,
    newPassword:string
}