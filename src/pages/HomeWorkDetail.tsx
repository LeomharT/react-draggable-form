import { EllipsisOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Empty, Form, FormInstance, Input, message, Radio, Result, Space, Spin, Typography, Upload, UploadFile } from "antd";
import FormItem from "antd/es/form/FormItem";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { ExerciseComponentType, HomeworkReply } from "../@types/exercise-types";
import { ExerciseType } from "../app/app-context";
import ChapterSelector from "../components/homework-detail/ChapterSelector";
import Toc from "../components/Toc";
import useUrlParams from "../hooks/useUrlParams";
import { fetchExerciseDetail, getCourseSectionHomeworkDetail, getwhetherCompeleSectionCourse, submitHomework, uploadAttached } from "../service/exercise";

export type HomeWorkDetailURLParams = {
    ID: string;
    CourseName: string;
    login_name: string;
};

export type ChapterItem = {
    schoolcourseSectionID: number;
    SectionName: string;
    Status: string;
    homeworkId: string;
};

const renderHomeworkItem = (data: ExerciseComponentType, formRef: RefObject<FormInstance>) =>
{
    switch (data.exercise_type)
    {
        case ExerciseType.CHOICE: {
            const selection = data.exercise_selection;
            return (
                <Radio.Group>
                    <Space direction='vertical'>
                        {
                            selection.map((v: any) =>
                            {
                                return (
                                    <Radio key={v.value} value={v.value}>{v.label}</Radio>
                                );
                            })
                        }
                    </Space>
                </Radio.Group>
            );
        }
        case ExerciseType.MULTICHOICE: {
            const selection = data.exercise_selection;
            return (
                <Checkbox.Group>
                    <Space direction="vertical">
                        {
                            selection.map((v: any) =>
                            {
                                return (
                                    <Checkbox key={v.value} value={v.value}>{v.label}</Checkbox>
                                );
                            })
                        }
                    </Space>
                </Checkbox.Group>
            );
        }
        case ExerciseType.JUDGE: {
            return (
                <Radio.Group>
                    <Space direction='vertical'>
                        <Radio value={'0'}>错误</Radio>
                        <Radio value={'1'}>正确</Radio>
                    </Space>
                </Radio.Group>
            );
        }
        case ExerciseType.UPLOAD: {
            const fileList: UploadFile[] = [];

            return (
                <Upload
                    fileList={fileList}
                    onRemove={(): void =>
                    {
                        fileList.length = 0;

                        formRef.current?.setFieldValue(data.exercise_id, '');
                    }}
                    customRequest={async (e) =>
                    {
                        const res = await uploadAttached(e.file as File);

                        formRef.current?.setFieldValue(data.exercise_id, res);

                        fileList.length = 0;

                        fileList.push({
                            uid: data.exercise_id,
                            status: 'done',
                            name: (e.file as File).name,
                            url: res,
                        });
                    }}
                >
                    <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
            );
        }
        case ExerciseType.BLANK:
        default: {
            return (
                <Input />
            );
        }
    }
};

export default function HomeWorkDetail()
{
    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);

    const urlParams = useUrlParams<HomeWorkDetailURLParams>();

    const [loading, setLoading] = useState<boolean>(true);

    const [chapterList, setChapterList] = useState<ChapterItem[]>([]);

    const [currChapter, setCurrChapter] = useState<ChapterItem | null>(null);

    /** 作业模板 */
    const [exerciseData, setExerciseData] = useState<ExerciseComponentType[]>([]);

    /** 作业内容 */
    const [homeworkDetail, setHomeworkDetail] = useState<HomeworkReply[]>([]);

    const getChapterList = useCallback(async (prarms: HomeWorkDetailURLParams, chapter?: ChapterItem) =>
    {
        const res = await getwhetherCompeleSectionCourse(prarms?.ID, prarms.login_name);

        setChapterList(res.result);

        if (chapter)
        {
            setCurrChapter(chapter);

        } else
        {
            if (res.result) setCurrChapter(res.result[0]);
        }

        setLoading(false);

    }, [setChapterList, setCurrChapter, setLoading]);


    const getExerciseDetail = useCallback(async (schoolCourseSectionId: string, homeworkId: string) =>
    {
        setLoading(true);

        await getHomeworkDetail(homeworkId);

        const exercise_data = await fetchExerciseDetail(schoolCourseSectionId);

        setExerciseData(exercise_data);

        setLoading(false);

    }, [setExerciseData, setLoading]);


    const getHomeworkDetail = useCallback(async (homeworkId: string) =>
    {
        const res = await getCourseSectionHomeworkDetail(homeworkId);

        setHomeworkDetail(res.result);

    }, [setHomeworkDetail]);


    const submitHomeworkData = useCallback(async (e: any, urlParams: HomeWorkDetailURLParams, currChapter: ChapterItem) =>
    {
        for (const k in e)
        {
            if (typeof e[k] === 'object')
            {
                e[k] = JSON.stringify(e[k]);
            }
        }

        const body = {
            login_name: urlParams.login_name.split('#')[0],
            school_course_sectionId: currChapter.schoolcourseSectionID,
            data: e
        };

        const res = await submitHomework(body);

        if (res.msg === 'success') message.success('提交成功');

        await getChapterList(urlParams, currChapter);
    }, [getChapterList]);


    useEffect(() =>
    {
        setLoading(true);

        if (!Object.keys(urlParams).length) return;

        getChapterList(urlParams);

    }, [getChapterList, urlParams]);


    useEffect(() =>
    {
        if (!currChapter) return;

        getExerciseDetail(currChapter.schoolcourseSectionID.toString(), currChapter.homeworkId);

    }, [currChapter, getExerciseDetail, getHomeworkDetail]);


    if (!urlParams.CourseName || !urlParams.ID || !urlParams.login_name)
    {
        return (
            <Result
                status="404"
                title="404"
                subTitle="没有找到对应课程请关闭重试"
            />
        );
    }


    if (!currChapter && !loading)
    {
        return (
            <Result
                status="404"
                title="404"
                subTitle="没有找到对应课程请关闭重试"
            />
        );
    }

    return (
        <div className="homework-detail">
            <ChapterSelector
                urlParams={urlParams}
                chapterList={chapterList}
                currChapter={currChapter}
                setCurrChapter={setCurrChapter}
                getHomeworkDetail={getHomeworkDetail}
            />
            <div className="exercise-area">
                <header>
                    <Button icon={<EllipsisOutlined />} shape='circle' size='small' />
                    <Button
                        type='primary'
                        disabled={!exerciseData.length}
                        onClick={() => formRef.current?.submit()}
                    >
                        保存
                    </Button>
                    <div style={{ marginRight: 'auto' }}>
                        {currChapter?.SectionName}
                    </div>
                </header>
                <main>
                    <Form
                        ref={formRef}
                        onFinish={e => submitHomeworkData(e, urlParams, currChapter as ChapterItem)}
                        onFinishFailed={() =>
                        {
                            message.error('您有未完成的题目,无法提交');
                        }}
                    >
                        {loading && <Spin spinning={loading} delay={500} />}
                        {!exerciseData.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='该章节暂时没有作业' />}
                        {
                            exerciseData.map((v, index) =>
                            {
                                return (
                                    <section id={v.exercise_id} className="homework-item" key={v.exercise_id}>
                                        <header>
                                            <div className="exercise-tags">
                                                <span>
                                                    {v.exercise_type}
                                                </span>
                                                <span>
                                                    {v.exercise_score.toString()}分
                                                </span>
                                            </div>
                                            <div className="exercise-titles">
                                                <Form.Item label={(index + 1).toString().padStart(2, '0')} >
                                                    <Typography.Title level={5}>{v.exercise_title}</Typography.Title>
                                                </Form.Item>
                                            </div>
                                        </header>
                                        <FormItem
                                            name={v.exercise_id}
                                            initialValue={
                                                homeworkDetail ? homeworkDetail[index]?.ExercisesReply : ''
                                            }
                                            rules={[{ required: Boolean(v.required), message: '该题目不能为空' }]}
                                        >
                                            {renderHomeworkItem(v, formRef)}
                                        </FormItem>
                                    </section>
                                );
                            })
                        }
                    </Form>
                    <Toc exerciseData={exerciseData} />
                </main>
            </div>
        </div>
    );
}
