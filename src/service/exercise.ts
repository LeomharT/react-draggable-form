import { ExerciseComponentType, ExerciseDetailData, IResponse, SearchCommitedHomeworkParams } from "../@types/exercise-types";
import { ExerciseType } from "../app/app-context";
import { defalutSelection } from "../components/ExerciseComponent";
import { REQUESTURL } from "../data/requests";

export const fetchExeriseDetail = async (schoolCourseSectionId: string): Promise<ExerciseComponentType[]> =>
{
    const res = await (await fetch(REQUESTURL.getCourseSectionExerciseDetail + `?schoolCourseSectionId=${schoolCourseSectionId}`)).json() as IResponse<ExerciseComponentType[]>;

    if (res.code !== 200)
    {
        return [];
    }
    const { Datas } = res.result;

    for (const [index, v] of Datas.entries())
    {
        if (v.exercise_type === ExerciseType.CHOICE || v.exercise_type === ExerciseType.MULTICHOICE)
        {
            if (v.exercise_selection !== '')
            {
                Datas[index] = {
                    ...Datas[index],
                    exercise_selection: JSON.parse(v.exercise_selection)
                };
            } else
            {
                Datas[index] = {
                    ...Datas[index],
                    exercise_selection: defalutSelection
                };
            }
        }
    }

    return Datas;
};

export const postExerseDetail = async (params: ExerciseDetailData) =>
{
    const res: IResponse<any> = await (await fetch(REQUESTURL.addCourseExercise, {
        method: 'POST',
        headers: {
            'content-type': 'application/json;'
        },
        body: JSON.stringify(params)
    }
    )).json();

    return res;
};

export const searchCommitedHomeworkData = async (params: SearchCommitedHomeworkParams): Promise<IResponse> =>
{
    let url = REQUESTURL.searchCommitedHomeworkData + '?';

    const params_arr: string[] = [];

    for (const k in params)
    {
        if (params[k])
        {
            params_arr.push(`${k}=${params[k]}`);
        }
    }

    url += params_arr.join('&');

    const res = await (await fetch(url)).json();

    return res;
};

export const getSectionCourse = async (ID: string) =>
{
    return await (await fetch(REQUESTURL.getSectionCourse + `?ID=${ID}`)).json();
};

export const getsubmitedStudentData = async () =>
{
    return await (await fetch(REQUESTURL.getsubmitedStudentData)).json();
};
