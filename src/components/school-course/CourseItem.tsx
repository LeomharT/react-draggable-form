import { Button, Card, Space } from "antd";
import { useId } from "react";
import { SchoolCourseItem } from "../../@types/course-types";

export type CourseItemType = {
    data: SchoolCourseItem;
};

const { Meta } = Card;

export default function CourseItem(props: CourseItemType)
{
    const id = useId();
    return (
        <div
            key={id}
            className="course-item-wrapper"
        >
            <Card
                hoverable
                cover={<img alt="cover" style={{ padding: "24px" }} src={props.data.CourseCoverUrl} />}
            >
                <Meta title={props.data.CourseName}
                    description={
                        <>
                            <span>{`课程名称:${props.data.ClassName}`}</span>
                            <span>{`授课老师:${props.data.TeacherId ?? ''}`}</span>
                        </>
                    } />
                <Meta description={`课程等级:${props.data.CourseLevel}`} />
                <Meta description={`课程人数:${props.data.EnterPerson ?? 0}`} />
                <p>{props.data.EnterDate}</p>
                <Space direction="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Button>学情分析</Button>
                    <Button type="primary">批改作业</Button>
                </Space>
            </Card>
        </div>
    );
}
