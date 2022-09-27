import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Empty, Form, Result, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { ExerciseComponentType } from "../@types/exercise-types";
import ChapterSelector from "../components/homework-detail/ChapterSelector";
import Toc from "../components/Toc";
import useUrlParams from "../hooks/useUrlParams";
import { fetchExeriseDetail, getwhetherCompeleSectionCourse } from "../service/exercise";

export type HomeWorkDetailURLParams = {
    ID: string;
    CourseName: string;
    login_name: string;
};

export type ChapterItem = {
    schoolcourseSectionID: number;
    SectionName: string;
    Status: string;
};

export default function HomeWorkDetail()
{
    const urlParams = useUrlParams<HomeWorkDetailURLParams>();

    const [loading, setLoading] = useState<boolean>(true);

    const [chapterList, setChapterList] = useState<ChapterItem[]>([]);

    const [currChapter, setCurrChapter] = useState<ChapterItem | null>(null);

    const [exerciseData, setExerciseData] = useState<ExerciseComponentType[]>([]);

    const getHomeWorkDetail = useCallback(async (school_course_sectionId: string) =>
    {
        setLoading(true);

        fetchExeriseDetail(school_course_sectionId).then(data =>
        {
            setExerciseData(data);

            setLoading(false);
        });
    }, []);


    useEffect(() =>
    {
        setLoading(true);

        if (!Object.keys(urlParams).length) return;

        getwhetherCompeleSectionCourse(urlParams?.ID, urlParams.login_name).then((data: { result: ChapterItem[]; }) =>
        {
            setChapterList(data.result);

            setCurrChapter(data.result[0]);

            setLoading(false);
        });

    }, [setChapterList, urlParams.ID, urlParams.login_name, urlParams]);


    useEffect(() =>
    {
        if (!currChapter) return;

        getHomeWorkDetail(currChapter.schoolcourseSectionID.toString());

    }, [currChapter, getHomeWorkDetail]);


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
            />
            <div className="exercise-area">
                <header>
                    <Button icon={<EllipsisOutlined />} shape='circle' size='small' />
                    <Button
                        type='primary'
                        disabled={!exerciseData.length}
                        onClick={async () =>
                        {

                        }}>
                        保存
                    </Button>
                    <div style={{ marginRight: 'auto' }}>
                        {currChapter?.SectionName}
                    </div>
                </header>
                <main>
                    <Form>
                        {loading && <Spin spinning={loading} delay={500} />}
                        {!exerciseData.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='该章节暂时没有作业' />}
                        {
                            exerciseData.map(v =>
                            {
                                return (
                                    <div key={v.exercise_id}>

                                    </div>
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
