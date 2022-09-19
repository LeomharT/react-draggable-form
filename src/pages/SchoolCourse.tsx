import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { SchoolCourseItem } from "../@types/course-types";
import { SearchSchoolCourseParams } from "../@types/exercise-types";
import HeadNavigate from "../components/HeadNavigate";
import CourseItem from "../components/school-course/CourseItem";
import { searchSchoolCourse } from "../service/exercise";
export default function SchoolCourse()
{
    const [courseList, setCourseList] = useState<SchoolCourseItem[]>([]);

    useEffect(() =>
    {
        searchSchoolCourse({} as SearchSchoolCourseParams).then(data =>
        {
            console.log(data);
            setCourseList(data.result.Datas);
        });

        console.log(courseList);
    }, []);

    return (
        <div className="school_course">
            <HeadNavigate />
            <main>
                {
                    courseList.map(v =>
                    {
                        return (
                            <CourseItem key={v.ID} data={v} />
                        );
                    })
                }
                <Pagination total={100} pageSize={9} showSizeChanger={false} />
            </main>
        </div>
    );
}
