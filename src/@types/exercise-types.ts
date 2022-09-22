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
        Datas: T;
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


export interface SearchCommitedHomeworkParams
{
    courseSectionID: string;
    currentPage: number;
    pageSize: number;
    submitStudentId?: string;
    correctStatus?: string;
}


export interface HomeworkDataItem
{
    CorrectDate: string;
    CorrectStatus: number;
    CorrectUserId: number;
    ExercisesId: number;
    ID: number;
    Score: number;
    SectionName: string;
    SubmitDate: string;
    SubmitStatus: number;
    SubmitStudentId: string;
}
