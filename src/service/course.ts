import { IResponse, SearchSchoolCourseParams } from "../@types/exercise-types";
import { LoginUserType } from "../@types/login.type";
import { fetchData, REQUEST_URL } from "../data/requests";

/** 获取课程列表 */
export const searchSchoolCourse = async (params: SearchSchoolCourseParams): Promise<IResponse<any>> =>
{
    let url: string;

    if (params.loginType === LoginUserType.STUDENT)
    {
        url = REQUEST_URL.studentSearchSchoolCourse;
    } else
    {
        url = REQUEST_URL.teacherSearchSchoolCourse;
    }

    url += '?';

    const params_arr: string[] = [];

    for (const k in params)
    {
        if (params[k])
        {
            params_arr.push(`${k}=${params[k]}`);
        }
    }

    url += params_arr.join('&');

    const res = await (await (fetchData(url))).json();

    return res;
};

/** 获取全部班级 */
export const getClassData = async (loginName: string) =>
{
    const res = await (
        await (fetchData(REQUEST_URL.getClassData + `?login_name=${loginName}`))
    ).json();

    return res;
};


/** 获取课程章节 */
export const getCourseSections = async (courseId: number) =>
{
    const res = await (
        await (fetchData(REQUEST_URL.getCourseSections + `?ID=${courseId}`))
    ).json();

    return res;
};
