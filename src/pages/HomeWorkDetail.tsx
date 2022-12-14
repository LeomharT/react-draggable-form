import { EllipsisOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Empty, Form, FormInstance, Input, message, Radio, Result, Space, Spin, Typography, Upload, UploadFile } from "antd";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { ExerciseComponentType, HomeworkReply } from "../@types/exercise-types";
import { ExerciseType } from "../app/app-context";
import ChapterSelector from "../components/homework-detail/ChapterSelector";
import Toc from "../components/Toc";
import useUrlParams from "../hooks/useUrlParams";
import { deleteFile, fetchExerciseDetail, getCourseSectionHomeworkDetail, getwhetherCompeleSectionCourse, submitHomework, uploadAttached } from "../service/exercise";

const { TextArea } = Input;

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

const renderHomeworkItem = (data: ExerciseComponentType, homeworkDetail: HomeworkReply | null, formRef: RefObject<FormInstance>) =>
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
                        <Radio value={'0'}>??????</Radio>
                        <Radio value={'1'}>??????</Radio>
                    </Space>
                </Radio.Group>
            );
        }
        case ExerciseType.UPLOAD: {

            const fileList: UploadFile[] = [];

            if (homeworkDetail?.ExercisesReply)
            {
                fileList.push({
                    uid: homeworkDetail?.ExercisesReply as string,
                    name: homeworkDetail?.ExercisesReply as string,
                    status: 'done',
                    url: homeworkDetail?.ExercisesReply as string
                });
            }

            return (
                <Upload
                    fileList={fileList}
                    onRemove={async (e) =>
                    {
                        const file = {
                            [data.exercise_id]: e.url
                        };

                        await deleteFile(JSON.stringify(file) as string);

                        fileList.length = 0;

                        formRef.current?.setFieldValue(data.exercise_id, '');
                    }}
                    customRequest={async (e) =>
                    {
                        message.loading({ content: "???????????????", key: "uoloading" });

                        const res = await uploadAttached(e.file as File);

                        formRef.current?.setFieldValue(data.exercise_id, res);

                        fileList.length = 0;

                        fileList.push({
                            uid: data.exercise_id,
                            status: 'done',
                            name: (e.file as File).name,
                            url: res,
                        });

                        message.success({ content: "????????????", key: "uoloading" });
                    }}
                >
                    <Button icon={<UploadOutlined />}>????????????</Button>
                </Upload>
            );
        }
        case ExerciseType.SHORTANSWER: {
            return (
                <TextArea autoSize={{ minRows: 5 }}>

                </TextArea>
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

    /** ???????????? */
    const [exerciseData, setExerciseData] = useState<ExerciseComponentType[]>([]);

    /** ???????????? */
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

        return res.result;

    }, [setChapterList, setCurrChapter, setLoading]);


    const getHomeworkDetail = useCallback(async (homeworkId: string) =>
    {
        const res = await getCourseSectionHomeworkDetail(homeworkId);

        setHomeworkDetail(res.result);

    }, [setHomeworkDetail]);


    const getExerciseDetail = useCallback(async (schoolCourseSectionId: string, homeworkId: string) =>
    {
        setLoading(true);

        if (homeworkId)
        {
            await getHomeworkDetail(homeworkId);
        }

        const exercise_data = await fetchExerciseDetail(schoolCourseSectionId);

        setExerciseData(exercise_data);

        setLoading(false);

    }, [setExerciseData, setLoading, getHomeworkDetail]);


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

        if (res.msg === 'success') message.success('????????????');

        const new_chapter_list: ChapterItem[] = await getChapterList(urlParams, currChapter);

        const homework_id = new_chapter_list.find(v => v.schoolcourseSectionID === currChapter.schoolcourseSectionID)?.homeworkId;

        if (homework_id)
        {
            await getHomeworkDetail(homework_id);
        }

    }, [getChapterList, getHomeworkDetail]);


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
                subTitle="???????????????????????????????????????"
            />
        );
    }


    if (!currChapter && !loading)
    {
        return (
            <Result
                status="404"
                title="404"
                subTitle="???????????????????????????????????????"
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
            />
            <div className="exercise-area">
                <header>
                    <Button icon={<EllipsisOutlined />} shape='circle' size='small' />
                    <Button
                        type='primary'
                        disabled={!exerciseData.length}
                        onClick={() => formRef.current?.submit()}
                    >
                        ??????
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
                            message.error('????????????????????????,????????????');
                        }}
                    >
                        {loading && <Spin spinning={loading} delay={500} />}
                        {!exerciseData.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='???????????????????????????' />}
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
                                                    {v.exercise_score.toString()}???
                                                </span>
                                            </div>
                                            <div className="exercise-titles">
                                                <Form.Item label={(index + 1).toString().padStart(2, '0')} >
                                                    <Typography.Title level={5}>{v.exercise_title}</Typography.Title>
                                                </Form.Item>
                                            </div>
                                        </header>
                                        <Form.Item
                                            name={v.exercise_id}
                                            initialValue={
                                                homeworkDetail.length ? homeworkDetail[index]?.ExercisesReply : ''
                                            }
                                            rules={[{ required: Boolean(v.required), message: '?????????????????????' }]}
                                        >
                                            {renderHomeworkItem(v, homeworkDetail[index], formRef)}
                                        </Form.Item>
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
