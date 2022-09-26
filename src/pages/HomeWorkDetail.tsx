import { BarsOutlined, EllipsisOutlined, SearchOutlined, ShareAltOutlined, StarOutlined, UserAddOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Divider, Result, Skeleton } from "antd";
import { useCallback, useEffect, useState } from "react";
import { ExerciseComponentType } from "../@types/exercise-types";
import BookSvg from "../components/BookSvg";
import useUrlParams from "../hooks/useUrlParams";
import { fetchExeriseDetail, getwhetherCompeleSectionCourse } from "../service/exercise";

type HomeWorkDetailURLParams = {
    ID: string;
    CourseName: string;
    login_name: string;
};

type ChapterItem = {
    schoolcourseSectionID: number;
    SectionName: string;
    Status: string;
};

export default function HomeWorkDetail()
{
    const urlParams = useUrlParams<HomeWorkDetailURLParams>();

    const [chapterList, setChapterList] = useState<ChapterItem[]>([]);

    const [currChapter, setCurrChapter] = useState<ChapterItem>({} as ChapterItem);

    const [exerciseData, setExerciseData] = useState<ExerciseComponentType[]>([]);

    /** 当前锚点 */
    const [currentId, setCurrentId] = useState<string>('');

    const getHomeWorkDetail = useCallback(async (school_course_sectionId: string) =>
    {
        fetchExeriseDetail(school_course_sectionId).then(data =>
        {
            setExerciseData(data);
        });
    }, []);

    useEffect(() =>
    {
        if (!Object.keys(urlParams).length) return;

        getwhetherCompeleSectionCourse(urlParams?.ID, urlParams.login_name).then((data: { result: ChapterItem[]; }) =>
        {
            setChapterList(data.result);
            setCurrChapter(data.result[0]);
        });

    }, [setChapterList, urlParams.ID, urlParams.login_name, urlParams]);

    useEffect(() =>
    {
        if (!currChapter.schoolcourseSectionID) return;
        getHomeWorkDetail(currChapter.schoolcourseSectionID.toString());
    }, [currChapter.schoolcourseSectionID, getHomeWorkDetail]);

    if (!urlParams.CourseName || !urlParams.ID || !urlParams.login_name)
    {
        return (
            <Result
                status="404"
                title="404"
                subTitle="没有找到对应课程请关闭重试"
            // extra={<Button type="primary">Back Home</Button>}
            />
        );
    }

    return (
        <div className="homework-detail">
            <Card className="chapter-navi">
                <header>
                    <BookSvg />
                    <span>{urlParams.CourseName}</span>
                </header>
                <Divider />
                <p><Button icon={<BarsOutlined />} type='text' />章节</p>
                {
                    chapterList.map(v =>
                    {
                        return (
                            <Badge.Ribbon
                                text={v.Status}
                                key={v.schoolcourseSectionID}
                                color={v.Status === '未完成' ? 'red' : 'green'}
                            >
                                <Card
                                    className="chapter-item"
                                    data-iscurr={currChapter?.SectionName === v.SectionName}
                                    hoverable
                                    onClick={() =>
                                    {
                                        setCurrChapter(v);
                                        console.log(v.schoolcourseSectionID);
                                    }}
                                >
                                    {v.SectionName}
                                </Card>
                            </Badge.Ribbon>
                        );
                    })
                }
            </Card>
            <div className="exercise-area">
                <header>
                    <Button icon={<EllipsisOutlined />} shape='circle' size='small' />
                    <Button
                        type='primary'
                        onClick={async () =>
                        {

                        }}>
                        保存
                    </Button>
                    {
                        [
                            <ShareAltOutlined />,
                            <UserAddOutlined />,
                            <StarOutlined />,
                            <SearchOutlined />,
                        ].map((v, index) => <Button icon={v} key={index} type='text' />)
                    }
                    <div style={{ marginRight: 'auto' }}>
                        {currChapter.SectionName}
                    </div>
                </header>
                <main>
                    <div>

                        <Skeleton active />
                    </div>
                    <aside className='toc-side-navi'>
                        <p style={{ fontWeight: "bold", marginLeft: "18px" }}>TOC</p>
                        <ul>
                            {
                                exerciseData.map(v =>
                                    <li key={v.exercise_id}>
                                        <Button
                                            type={v.exercise_id === currentId ? 'link' : 'text'}
                                            href={`#${v.exercise_id}`}
                                            data-current={v.exercise_id === currentId}
                                            onClick={() =>
                                            {
                                                setCurrentId(v.exercise_id);
                                            }}>
                                            {v.exercise_title}
                                        </Button>
                                    </li>
                                )
                            }
                        </ul>
                    </aside>
                </main>
            </div>
        </div>
    );
}
