import { BarsOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Divider } from "antd";
import React from "react";
import { ChapterItem, HomeWorkDetailURLParams } from "../../pages/HomeWorkDetail";
import BookSvg from "../BookSvg";

export type ChapterSelectorProps = {
    urlParams: HomeWorkDetailURLParams;
    chapterList: ChapterItem[];
    currChapter: ChapterItem | null;
    setCurrChapter: React.Dispatch<React.SetStateAction<ChapterItem | null>>;
    getHomeworkDetail: (homeworkId: string) => Promise<void>;
};

export default function ChapterSelector(props: ChapterSelectorProps)
{
    return (
        <Card className="chapter-navi">
            <header>
                <BookSvg />
                <span>{props.urlParams.CourseName}</span>
            </header>
            <Divider />
            <p><Button icon={<BarsOutlined />} type='text' />章节</p>
            {
                props.chapterList.map(v =>
                {
                    return (
                        <Badge.Ribbon
                            text={v.Status}
                            key={v.schoolcourseSectionID}
                            color={v.Status === '未完成' ? 'red' : 'green'}
                        >
                            <Card
                                className="chapter-item"
                                data-iscurr={props.currChapter?.SectionName === v.SectionName}
                                hoverable
                                onClick={() =>
                                {
                                    props.setCurrChapter(v);

                                    if (props.currChapter?.schoolcourseSectionID === v.schoolcourseSectionID) return;

                                    props.getHomeworkDetail(v?.homeworkId);
                                }}
                            >
                                {v.SectionName}
                            </Card>
                        </Badge.Ribbon>
                    );
                })
            }
        </Card>
    );
}
