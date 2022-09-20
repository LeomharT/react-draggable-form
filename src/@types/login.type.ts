export enum LoginUserType
{
    SUPER_ADMIN = '1',
    ADMIN = '2',
    TEACHER = '3',
    STUDENT = '4',
}


export interface LoginUserInfo
{
    loginName: string;
    loginType: LoginUserType;
}
