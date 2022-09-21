import { IResponse, SearchSchoolCourseParams } from "../@types/exercise-types";
import { REQUESTURL } from "../data/requests";

/** 获取课程列表 */
export const searchSchoolCourse = async (params: SearchSchoolCourseParams): Promise<IResponse<any>> =>
{
    let url = REQUESTURL.searchSchoolCourse + '?';

    const params_arr: string[] = [];

    for (const k in params)
    {
        if (params[k])
        {
            params_arr.push(`${k}=${params[k]}`);
        }
    }

    url += params_arr.join('&');

    const res = await (await (fetch(url))).json();

    return res;
};

/** 获取全部班级 */
export const getClassData = async (loginName: string) =>
{
    const res = await (
        await (fetch(REQUESTURL.getClassData + `?login_name=${loginName}`))
    ).json();

    return res;
};
