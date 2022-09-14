import { ExerciseType } from "../app/app-context";

export interface ExerciseComponentType
{
    id?: number;
    exercise_id: string;
    exercise_score: number;
    exercise_title: string;
    exercise_answer: string;
    exercise_type: ExerciseType;
    exercise_description: string;
    exercise_selection: string;
    required: boolean;
};


export interface IResponse<T extends any = any>
{
    code: number;
    msg: string;
    result: {
        [index: string]: any;
        data: T;
    };
}
