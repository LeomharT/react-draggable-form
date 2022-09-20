import { combineReducers } from "redux";
import { LoginUserInfo, LoginUserType } from "../@types/login.type";
import { ActionProps } from "./store";

function loginUserInfoReducer(state: LoginUserInfo, action: ActionProps<string, LoginUserInfo>): LoginUserInfo
{
    if (typeof state === 'undefined') return { loginName: 'admin', loginType: LoginUserType.SUPER_ADMIN };
    switch (action.type)
    {
        case 'setLoginUserInfo':
            state = action.payload;
            return state;
        case 'getLoginUserInfo':
        default:
            state = { loginName: 'admin', loginType: LoginUserType.SUPER_ADMIN };
            return state;
    }
}

export const rootReduser = combineReducers({
    loginUserInfoReducer
});

export type RootState = ReturnType<typeof rootReduser>;
