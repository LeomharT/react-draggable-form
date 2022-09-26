import { Button, Card, Divider, Space } from "antd";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { SchoolCourseItem } from "../../@types/course-types";
import { LoginUserType } from "../../@types/login.type";
import { HOST } from "../../data/requests";
import { loginUserInfoSelector } from "../../redux/selector";

export type CourseItemType = {
    data: SchoolCourseItem;
};

const { Meta } = Card;

export default function CourseItem(props: CourseItemType)
{
    const navigate = useNavigate();

    const userInfo = useSelector(loginUserInfoSelector);

    const renderNavigateButton = useCallback((loginType: LoginUserType, data: SchoolCourseItem) =>
    {
        if (loginType === LoginUserType.STUDENT)
        {
            return (
                <Button type="primary" onClick={() =>
                {
                    window.open(`${HOST}/homework_detail?ID=${data.ID}&CourseName=${data.CourseName}`, '_blank');
                }}>
                    进入作业
                </Button>
            );
        }
        return (
            <Button type="primary" onClick={() =>
            {
                navigate(`/mark_homework/${data.ID}`);
            }}>
                批改作业
            </Button>
        );
    }, [navigate]);

    return (
        <div
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
                            <span>{`授课老师:${props.data.TeacherName ?? ''}`}</span>
                        </>
                    }
                />
                <Meta
                    description={
                        <>
                            <span>{`课程等级:${props.data.CourseLevel}`}</span>
                            <span>{`课程人数:${props.data.ClassSize ?? 0}`}</span>
                        </>
                    }
                />
                <Meta
                    description={
                        <>
                            <span>{`已提交:${props.data.SubmitedCount}`}</span>
                            <span>{`已批改:${props.data.CorrectedCount}`}</span>
                        </>
                    }
                />
                <Divider />
                <Space direction="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Button>学情分析</Button>
                    {renderNavigateButton(userInfo.loginType, props.data)}
                </Space>
            </Card>
        </div>
    );
}
