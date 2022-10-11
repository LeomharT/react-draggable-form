import { ExerciseComponentType, ExerciseDetailData, GetUnsubmitedStudentDetailParams, IResponse, SearchCommitedHomeworkParams } from "../@types/exercise-types";
import { ExerciseType } from "../app/app-context";
import { defalutSelection } from "../components/ExerciseComponent";
import { REQUEST_URL } from "../data/requests";

/** 获取作业内容 */
export const fetchExerciseDetail = async (schoolCourseSectionId: string): Promise<ExerciseComponentType[]> =>
{
    const res = await (await fetch(REQUEST_URL.getCourseSectionExerciseDetail + `?schoolCourseSectionId=${schoolCourseSectionId}`)).json() as IResponse<ExerciseComponentType[]>;

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

/** 创建作业 */
export const postExerseDetail = async (params: ExerciseDetailData) =>
{
    const res: IResponse<any> = await (await fetch(REQUEST_URL.addCourseExercise, {
        method: 'POST',
        headers: {
            'content-type': 'application/json;'
        },
        body: JSON.stringify(params)
    }
    )).json();

    return res;
};

/** 搜索提交作业列表 */
export const searchCommitedHomeworkData = async (params: SearchCommitedHomeworkParams): Promise<IResponse> =>
{
    let url = REQUEST_URL.searchCommitedHomeworkData + '?';

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

/** 获取课程章节(下拉框) */
export const getSectionCourse = async (ID: string) =>
{
    return await (await fetch(REQUEST_URL.getSectionCourse + `?ID=${ID}`)).json();
};

/** 获取提交作业学生 */
export const getsubmitedStudentData = async (id: string) =>
{
    return await (await fetch(REQUEST_URL.getsubmitedStudentData + `?ID=${id}`)).json();
};

/** 获取作业章节 */
export const getwhetherCompeleSectionCourse = async (id: string, login_name: string) =>
{
    return await (await fetch(REQUEST_URL.getwhetherCompeleSectionCourse + `?ID=${id}&login_name=${login_name}`)).json();
};

/** 上传作业附件 */
export const uploadAttached = async (file: File) =>
{
    const formData = new FormData();

    formData.set('file', file);

    const res = await (await fetch(REQUEST_URL.file_upload, {
        method: 'POST',
        body: formData
    })).json();

    return res;
};

/** 提交作业 */
export const submitHomework = async (data: { login_name: string; school_course_sectionId: number; data: any; }): Promise<IResponse> =>
{
    const res = await (await fetch(REQUEST_URL.submitHomework, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })).json();

    return res;
};


/** 获取学生提交作业详情 */
export const getCourseSectionHomeworkDetail = async (homeworkId: string) =>
{
    return await (await fetch(REQUEST_URL.getCourseSectionHomeworkDetail + `?homeworkId=${homeworkId}`)).json();
};

/** 删除附件 */
export const deleteFile = async (fileName: string): Promise<IResponse> =>
{
    return await (await fetch(REQUEST_URL.deleteFile + `?filename=${fileName}`)).json();
};

/** 提交老师批改作业成绩 */
export const correctHomework = async (body: any) =>
{
    return await (await fetch(REQUEST_URL.correctHomework, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    })).json();
};

/** 获取未提交学生数据 */
export const getUnsubmitedStudent = async (courseSectionID: string) =>
{
    return await (await fetch(`${REQUEST_URL.getUnsubmitedStudent}?courseSectionID=${courseSectionID}`)).json();
};


export const getUnsubmitedStudentDetail = async (params: GetUnsubmitedStudentDetailParams) =>
{
    let url = REQUEST_URL.getUnsubmitedStudentDetail + '?';

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
