import { message } from "antd";
import { ExerciseComponentType, IResponse } from "../@types/ExerciseComponentTypes";
import { REQUESTURL } from "../data/requests";

export const fetchExeriseDetail = async (): Promise<ExerciseComponentType[]> =>
{
    const res = await (await fetch(REQUESTURL.addCourseExercise)).json() as IResponse<ExerciseComponentType[]>;

    if (res.code !== 200)
    {
        message.error('请求出错请刷新重试');
        return [];
    }

    return res.result.data;
};
