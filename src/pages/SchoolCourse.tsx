import { Pagination, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { SchoolCourseItem } from "../@types/course-types";
import { SearchSchoolCourseParams } from "../@types/exercise-types";
import HeadNavigate from "../components/HeadNavigate";
import CourseItem from "../components/school-course/CourseItem";
import { searchSchoolCourse } from "../service/exercise";
export default function SchoolCourse()
{
    const [courseList, setCourseList] = useState<SchoolCourseItem[]>([]);

    const [totalPage, setTotalPage] = useState<number>(0);

    const [currPage, setCurrPage] = useState<number>(1);

    useEffect(() =>
    {
        searchSchoolCourse({} as SearchSchoolCourseParams).then(data =>
        {
            setTotalPage(data.result.Total);
            setCourseList(data.result.Datas);
        });
    }, []);

    return (
        <div className="school_course">
            <HeadNavigate />
            <main>
                <Spin spinning={!Boolean(courseList.length)} tip='加载中...' size="large" ></Spin>
                {
                    courseList.map(v =>
                    {
                        return (
                            <CourseItem key={v.ID} data={v} />
                        );
                    })
                }
                {
                    Boolean(courseList.length) && <Space className="school-course-pagination">
                        <Pagination
                            pageSize={12}
                            current={currPage}
                            total={totalPage}
                            showSizeChanger={false}
                            onChange={e => setCurrPage(e)}
                        />
                    </Space>
                }
            </main>
        </div>
    );
}
