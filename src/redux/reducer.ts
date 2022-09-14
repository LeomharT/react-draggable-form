import { combineReducers } from "redux";
import { ExerciseComponentType } from "../@types/ExerciseComponentTypes";
import { ActionProps } from "./store";

export function fetchExeriseDetailReducer(state: ExerciseComponentType[] = [], action: ActionProps<string, ExerciseComponentType[]>): ExerciseComponentType[]
{
    if (typeof state === 'undefined') return [];

    switch (action.type)
    {
        case 'fetchExeriseDetailFail':
            return state;
        case 'fetchExeriseDetailSuccess':
        default:
            if (action.payload)
                state = action.payload;
            return state;
    }
};

export const rootReduser = combineReducers({
    fetchExeriseDetailReducer
});

export type RootState = ReturnType<typeof rootReduser>;
