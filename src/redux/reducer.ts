import { combineReducers } from "redux";
import { LoginUserInfo } from "../@types/login.type";
import { ActionProps } from "./store";

function loginUserInfoReducer(state: LoginUserInfo, action: ActionProps<string, LoginUserInfo>): LoginUserInfo | null
{
    if (typeof state === 'undefined') return null;
    switch (action.type)
    {
        case 'setLoginUserInfo':
            state = action.payload;
            return state;
        case 'getLoginUserInfo':
        default:
            return state;
    }
}

export const rootReduser = combineReducers({
    loginUserInfoReducer
});

export type RootState = ReturnType<typeof rootReduser>;
