import { ExerciseType } from "../app/app-context";

export interface ExerciseComponentType
{
    id: string;
    type: ExerciseType;
    request: boolean;
    title: string;
    score: number;
    anwser: number;
};

export interface ExerciseComponentBlank extends ExerciseComponentType
{

}
