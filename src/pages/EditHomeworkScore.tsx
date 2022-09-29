import { EllipsisOutlined, LeftOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, FormInstance, Input, InputNumber, message, Radio, Result, Space, Typography, Upload, UploadFile } from "antd";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { ExerciseComponentType, HomeworkReply } from "../@types/exercise-types";
import { ExerciseType } from "../app/app-context";
import { loginUserInfoSelector } from "../redux/selector";
import { correctHomework, fetchExerciseDetail, getCourseSectionHomeworkDetail } from "../service/exercise";

const { TextArea } = Input;

const renderHomeworkItem = (data: ExerciseComponentType, homeworkDetail: HomeworkReply | null): JSX.Element =>
{
    const answer: any = homeworkDetail?.ExercisesReply;

    switch (data.exercise_type)
    {
        case ExerciseType.CHOICE: {
            const selection = data.exercise_selection;
            return (
                <Radio.Group value={answer}>
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
                <Checkbox.Group value={answer}>
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
                <Radio.Group value={answer}>
                    <Space direction='vertical'>
                        <Radio value={'0'}>错误</Radio>
                        <Radio value={'1'}>正确</Radio>
                    </Space>
                </Radio.Group>
            );
        }
        case ExerciseType.UPLOAD: {
            const fileList: UploadFile[] = [];

            fileList.push({
                uid: answer,
                status: 'done',
                url: answer,
                name: answer,
            });
            return (
                <Upload
                    fileList={fileList}
                >
                </Upload>
            );
        }
        case ExerciseType.SHORTANSWER: {
            return (
                <TextArea value={answer} readOnly autoSize={{ minRows: 5 }}>

                </TextArea>
            );
        }
        case ExerciseType.BLANK:
        default: {
            return (
                <Input value={answer} readOnly />
            );
        }
    }
};

export default function EditHomeworkScore()
{
    const navigate = useNavigate();

    const userInfo = useSelector(loginUserInfoSelector);

    /** 路由状态 */
    const { homeworkId, schoolCourseSectionID, sectionName } = useLocation().state as any;

    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);

    const [loading, setLoading] = useState<boolean>(true);

    /** 作业模板 */
    const [exerciseData, setExerciseData] = useState<ExerciseComponentType[]>([]);

    /** 作业内容 */
    const [homeworkDetail, setHomeworkDetail] = useState<HomeworkReply[]>([]);


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


    const submitHomeworkScore = useCallback(async (e: any, loginName: string, homeworkId: string) =>
    {
        const data_arr: any[] = [];

        for (const k in e)
        {
            data_arr.push(e[k]);
        }

        const scores = [];

        for (let i = 0; i < data_arr.length; i += 2)
        {
            const obj = {
                Score: data_arr[i],
                Comment: data_arr[i + 1]
            };

            scores.push(obj);
        }

        const body = {
            ID: homeworkId,
            login_name: loginName,
            data: scores
        };

        setLoading(true);

        const res = await correctHomework(body);

        setLoading(false);

        if (res.msg) message.success('保存成功');

    }, []);


    useEffect(() =>
    {
        if (!homeworkId || !schoolCourseSectionID) return;

        getExerciseDetail(schoolCourseSectionID, homeworkId);

    }, [homeworkId, schoolCourseSectionID, getExerciseDetail]);


    /** 隐藏原始头部导航 */
    useEffect(() =>
    {
        const top = document.querySelector('#top') as HTMLDivElement;

        if (top)
        {
            top.style.display = 'none';
        }
        return () =>
        {
            if (top)
            {
                top.style.display = 'block';
            }
        };
    }, []);


    if (!homeworkId || !schoolCourseSectionID)
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
        <Form
            className="edit-homwork-score"
            ref={formRef}
            onFinish={e => submitHomeworkScore(e, userInfo.loginName, homeworkId)}
        >
            <header>
                <Button icon={<EllipsisOutlined />} shape='circle' size='small' />
                <Button
                    type='primary'
                    disabled={!exerciseData.length}
                    loading={loading}
                    onClick={() => formRef.current?.submit()}
                >
                    保存
                </Button>
                <div style={{ marginRight: 'auto' }}>
                    {sectionName}
                </div>
                <Button type="text" icon={<LeftOutlined />} onClick={() => navigate(-1)} />
            </header>
            <main>
                <div className="exercise-asnwers">
                    {exerciseData.map((v, index) =>
                    {
                        return (
                            <section key={v.exercise_id} className="homework-item">
                                <div className="exercise-answers">
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
                                    {renderHomeworkItem(v, homeworkDetail[index])}
                                </div>
                                <div className="exercise-score">
                                    <Form.Item label='分数' initialValue={0} name={`${v.exercise_id}Score`}>
                                        <InputNumber min={0} max={v.exercise_score} />
                                    </Form.Item>
                                    <Form.Item initialValue={''} name={`${v.exercise_id}Comment`}>
                                        <TextArea placeholder="请输入评语" />
                                    </Form.Item>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main >
        </Form >
    );
}
