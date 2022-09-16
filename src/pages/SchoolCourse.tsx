import { Card } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { SearchSchoolCourseParams } from "../@types/exercise-types";
import HeadNavigate from "../components/HeadNavigate";
import { searchSchoolCourse } from "../service/exercise";
export default function SchoolCourse()
{
    const [courseList, setCourseList] = useState<any[]>([]);

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
                            <div key={uuidv4()} style={{ width: '25%', maxWidth: '25%', padding: '5px' }}>
                                <Card>123</Card>
                            </div>
                        );
                    })
                }

            </main>
        </div>
    );
}
