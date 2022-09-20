import { LoginUserType } from "../@types/login.type";

export const findEnumKey = (value: LoginUserType) =>
{
    return (
        Object.keys(LoginUserType).find((key: string) =>
        {
            return (
                //@ts-ignore
                LoginUserType[key] === value
            );
        })
    );
};
