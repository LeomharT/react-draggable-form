import { message } from "antd";
import { ExerciseComponentType, ExerciseDetailData, IResponse, SearchCommitedHomeworkParams } from "../@types/exercise-types";
import { ExerciseType } from "../app/app-context";
import { defalutSelection } from "../components/ExerciseComponent";
import { REQUESTURL } from "../data/requests";

export const fetchExeriseDetail = async (): Promise<ExerciseComponentType[]> =>
{
    const res = await (await fetch(REQUESTURL.fetchExerciseDetail)).json() as IResponse<ExerciseComponentType[]>;

    if (res.code !== 200)
    {
        message.error('请求出错请刷新重试');
        return [];
    }
    const { data } = res.result;

    for (const [index, v] of data.entries())
    {
        if (v.exercise_type === ExerciseType.CHOICE || v.exercise_type === ExerciseType.MULTICHOICE)
        {
            if (v.exercise_selection !== '')
            {
                data[index] = {
                    ...data[index],
                    exercise_selection: JSON.parse(v.exercise_selection)
                };
            } else
            {
                data[index] = {
                    ...data[index],
                    exercise_selection: defalutSelection
                };
            }
        }
    }

    return data;
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
