import { Empty, Form, FormInstance, Input, Pagination, Radio, Select, Space, Spin } from "antd";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ClassFilter, SchoolCourseItem } from "../@types/course-types";
import { SearchSchoolCourseParams } from "../@types/exercise-types";
import { LoginUserInfo } from "../@types/login.type";
import HeadNavigate from "../components/HeadNavigate";
import CourseItem from "../components/school-course/CourseItem";
import { loginUserInfoSelector } from "../redux/selector";
import { getClassData, searchSchoolCourse } from "../service/course";

const { Option } = Select;

const PAGE_SIZE = 12;

export default function SchoolCourse()
{
    const userInfo: LoginUserInfo = useSelector(loginUserInfoSelector);

    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);

    /** 是否加载数据中 */
    const [pendding, setPendding] = useState<boolean>(true);

    /** 课程列表 */
    const [courseList, setCourseList] = useState<SchoolCourseItem[]>([]);

    /** 总页数 */
    const [totalPage, setTotalPage] = useState<number>(0);

    /** 当前页码 */
    const [currPage, setCurrPage] = useState<number>(1);

    /** 所有班级(数据筛选) */
    const [allClass, setAllClass] = useState<ClassFilter[]>([]);

    /** 筛选数据触发事件 */
    const onSearchCourse = useCallback(async (params: SearchSchoolCourseParams) =>
    {
        setCourseList([]);

        setPendding(true);

        const res = await searchSchoolCourse(params);

        setPendding(false);

        setTotalPage(res.result.Total);

        setCourseList(res.result.Datas);

    }, []);

    useEffect(() =>
    {
        if (!userInfo) return;

        getClassData(userInfo.loginName).then(data =>
        {
            setAllClass(data.result);
        });

    }, [setAllClass, userInfo]);

    useEffect(() =>
    {
        if (!userInfo) return;

        onSearchCourse({
            loginname: userInfo.loginName,
            pageSize: PAGE_SIZE,
            currentPage: 1,
        });

    }, [userInfo, onSearchCourse]);

    return (
        <div className="school_course">
            <HeadNavigate />
            <Form
                ref={formRef}
                layout='inline'
                onFinish={e => onSearchCourse({
                    loginname: userInfo?.loginName,
                    currentPage: 1,
                    pageSize: PAGE_SIZE,
                    courseName: e.courseName,
                    classID: e.classId,
                    CourseLevel: e.courseLevel
                })}
            >
                <Form.Item name='courseLevel' label='课程类型' initialValue={0}>
                    <Radio.Group onChange={() => formRef.current?.submit()}>
                        <Radio.Button value={0}>全部</Radio.Button>
                        <Radio.Button value={1}>入门</Radio.Button>
                        <Radio.Button value={2}>基础</Radio.Button>
                        <Radio.Button value={3}>进阶</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name='courseName' label='课程名称'>
                    <Input.Search placeholder="请输入班级名称" onSearch={() => formRef.current?.submit()} />
                </Form.Item>
                <Form.Item name='classId' label='班级名称'>
                    <Select placeholder='选择班级名称' allowClear onChange={() => formRef.current?.submit()}>
                        {
                            allClass.map(v =>
                            {
                                return (
                                    <Option key={v.ID}>
                                        {v.ClassName}
                                    </Option>
                                );
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
            <main>
                <Spin spinning={pendding} tip='加载中...' size="large"></Spin>
                {
                    courseList.map(v =>
                    {
                        return (
                            <CourseItem key={v.ID} data={v} />
                        );
                    })
                }
                {
                    (Boolean(courseList.length === 0) && !pendding) && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='没有相关课程' />
                }
                {
                    !pendding && <Space className="school-course-pagination">
                        <Pagination
                            pageSize={12}
                            current={currPage}
                            total={totalPage}
                            showSizeChanger={false}
                            onChange={e =>
                            {
                                setCurrPage(e);

                                console.log(formRef.current?.getFieldsValue(['courseLevel']));
                            }}
                        />
                    </Space>
                }
            </main>
        </div>
    );
}
