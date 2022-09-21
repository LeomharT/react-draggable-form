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
    exercise_selection: any;
    required: boolean;
};

export interface ExerciseDetailData
{
    login_name: string;
    school_course_id: number;
    school_course_sectionId: number;
    data: ExerciseComponentType[];
}

export interface IResponse<T extends any = any>
{
    code: number;
    msg: string;
    result: {
        [index: string]: any;
        data: T;
    };
}

export interface SearchSchoolCourseParams
{
    [key: string]: any;
    loginname: string;
    currentPage: number;
    pageSize: number;
    classID?: number;
    courseName?: string;
    courseLevel?: string;
}
