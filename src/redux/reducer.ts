import { combineReducers } from "redux";
import { ActionProps } from "./store";

function adminReducer(state: string, action: ActionProps<string, string>)
{
    if (typeof state === 'undefined') return '';
    switch (action.type)
    {
        case 'setAmind':
            state = action.payload;
            return state;
        case 'getAdmin':
        default:
            state = '350000_admin';
            return state;
    }
}

export const rootReduser = combineReducers({
    adminReducer
});

export type RootState = ReturnType<typeof rootReduser>;
