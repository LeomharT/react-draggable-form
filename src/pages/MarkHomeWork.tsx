import { FormOutlined, LeftOutlined, MoreOutlined, ProfileOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Empty, Form, FormInstance, Menu, Popover, Select, Table, Tabs, Tag } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HomeworkDataItem, HomeworkUnsubmittedDataItem, SearchCommitedHomeworkParams } from '../@types/exercise-types';
import BookSvg from '../components/BookSvg';
import UnsubmittedStudentDetail from '../components/markhomework/UnsubmittedStudentDetail';
import { getSectionCourse, getsubmitedStudentData, getUnsubmitedStudent, searchCommitedHomeworkData } from '../service/exercise';

const PAGE_SIZE = 20;

const { Option } = Select;

enum HomeworkTabs
{
    Submited = 'submited',
    UnSubmited = 'unsubmitted'
}

export default function MarkHomeWork()
{
    const navigate = useNavigate();


    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);


    const { courseSectionID } = useParams();


    const [homeworkList, setHomeworkList] = useState<HomeworkDataItem[] & HomeworkUnsubmittedDataItem[]>([]);


    /** 章节列表 */
    const [chapters, setChapters] = useState<any[]>([]);


    /** 提交作业学生列表 */
    const [submittedStd, setSubmittedStd] = useState<any[]>([]);


    const [activeTab, setActiveTab] = useState<HomeworkTabs>(HomeworkTabs.Submited);


    const [loading, setLoading] = useState<boolean>(false);


    const [isOpen, setOpen] = useState<boolean>(false);


    /** 保存当前选中的章节ID */
    const [sectionID, setSectionID] = useState<number | undefined>(undefined);


    const columns = useMemo<ColumnType<HomeworkDataItem | HomeworkUnsubmittedDataItem>[]>((): any =>
    {
        if (activeTab === HomeworkTabs.Submited)
        {
            return ([
                {
                    title: '章节名称',
                    dataIndex: 'SectionName',
                    key: 'SectionName',
                    render: (text: string) => <a><BookSvg />{text}</a>,
                }, {
                    title: '作业状态',
                    dataIndex: 'CorrectStatus',
                    key: 'CorrectStatus',
                    render: (data: number) => data === 1 ? <Tag color='error'>未批改</Tag> : <Tag color='success'>已批改</Tag>
                }, {
                    title: '作业分数',
                    dataIndex: 'Score',
                    key: 'Score',
                }, {
                    title: '提交时间',
                    dataIndex: 'SubmitDate',
                    key: 'SubmitDate',
                }, {
                    title: '学生',
                    dataIndex: 'SubmitStudentId',
                    key: 'SubmitStudentId',
                }, {
                    title: '操作',
                    dataIndex: 'Action',
                    key: 'Action',
                    render: (_: any, record: HomeworkDataItem) =>
                    {
                        return (
                            <Popover
                                trigger='focuse'
                                showArrow={false}
                                placement='bottomRight'
                                content={<Menu mode='vertical' className='popover-menu' items={[
                                    {
                                        label: '批改作业', key: "mark", icon: <FormOutlined />,
                                        onClick: () =>
                                        {
                                            navigate(
                                                '/edit_homwork_score', {
                                                state: {
                                                    homeworkId: record.ID,
                                                    schoolCourseSectionID: record.SchoolCourseSectionID,
                                                    sectionName: record.SectionName
                                                }
                                            });
                                        }
                                    },
                                    {
                                        label: '重新批改', key: "remark", icon: <RedoOutlined />,
                                        onClick: () =>
                                        {
                                            navigate(
                                                '/edit_homwork_score', {
                                                state: {
                                                    homeworkId: record.ID,
                                                    schoolCourseSectionID: record.SchoolCourseSectionID,
                                                    sectionName: record.SectionName
                                                }
                                            });
                                        }
                                    },
                                    {
                                        label: '详情', key: "detail", icon: <ProfileOutlined />,
                                        onClick: () =>
                                        {
                                            navigate(
                                                '/edit_homwork_score', {
                                                state: {
                                                    homeworkId: record.ID,
                                                    schoolCourseSectionID: record.SchoolCourseSectionID,
                                                    sectionName: record.SectionName
                                                }
                                            });
                                        }
                                    },
                                ]}>
                                </Menu>}>
                                <Button icon={<MoreOutlined />} type='text' />
                            </Popover>
                        );
                    }
                }]
            ) as ColumnType<HomeworkDataItem>[];
        }

        if (activeTab === HomeworkTabs.UnSubmited)
        {
            return ([
                {
                    title: '章节名称',
                    dataIndex: 'sectionName',
                    key: 'sectionName',
                    render: (text: string) => <a><BookSvg />{text}</a>,
                }, {
                    title: '班级人数',
                    dataIndex: 'totalStudent',
                    key: 'totalStudent',
                }, {
                    title: '未提交人数',
                    dataIndex: 'unsubmitdeCount',
                    key: 'unsubmitdeCount',
                }, {
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    render: (_: any, { schoolcourseSectionID }: HomeworkUnsubmittedDataItem) => (
                        <a onClick={async () =>
                        {
                            setOpen(true);
                            setSectionID(schoolcourseSectionID);
                        }}>
                            查看
                        </a>
                    )
                },
            ]) as ColumnType<HomeworkUnsubmittedDataItem>[];
        }
    }, [navigate, activeTab, setOpen]);


    /** 搜索已提交学生数据 */
    const searchHomeworkData = useCallback(async (params: SearchCommitedHomeworkParams) =>
    {
        setLoading(true);

        const res = await searchCommitedHomeworkData(params);

        setLoading(false);

        if (res.code !== 200) return;

        setHomeworkList(res.result.Datas);

    }, []);


    /** 搜索未提交学生数据 */
    const searchUnSubmitHomeworkData = useCallback(async (courseSectionID: string) =>
    {
        setLoading(true);

        const res = await getUnsubmitedStudent(courseSectionID);

        setLoading(false);

        if (res.code !== 200) return;

        setHomeworkList(res.result.Datas);
    }, []);


    const setSectionCourse = useCallback(async (courseSectionID: string) =>
    {
        const res = await getSectionCourse(courseSectionID);

        setChapters(res.result);
    }, []);


    const setSubMitedStudentData = useCallback(async (courseSectionID: string) =>
    {
        const res = await getsubmitedStudentData(courseSectionID);
        setSubmittedStd(res.result);
    }, []);


    useEffect(() =>
    {
        if (!courseSectionID) return;

        searchHomeworkData({
            currentPage: 1,
            courseSectionID,
            pageSize: PAGE_SIZE,
        });

        setSectionCourse(courseSectionID);

        setSubMitedStudentData(courseSectionID);

    }, [courseSectionID, searchHomeworkData, setSectionCourse, setSubMitedStudentData]);

    return (
        <div className='mark_homework'>
            <Tabs
                size='large'
                activeKey={activeTab}
                items={[
                    { label: '已提交学生', key: HomeworkTabs.Submited },
                    { label: '未提交学生', key: HomeworkTabs.UnSubmited },
                ]}
                tabBarExtraContent={{
                    right: activeTab === HomeworkTabs.Submited && <Form
                        ref={formRef}
                        layout='inline'
                        onFinish={e =>
                        {
                            if (!courseSectionID) return;

                            searchHomeworkData({
                                currentPage: 1,
                                courseSectionID,
                                pageSize: PAGE_SIZE,
                                ...e
                            });
                        }}>
                        <Form.Item label='学生' name={'submitStudentId'}>
                            <Select allowClear placeholder='请选择学生姓名' onChange={() => formRef.current?.submit()}>
                                {submittedStd.map(v => <Option key={v.id} value={v.id}>{v.submitedName}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item label='状态' name={'correctStatus'}>
                            <Select allowClear placeholder='请选择批改状态' onChange={() => formRef.current?.submit()}>
                                <Option value={1}>未批改</Option>
                                <Option value={2}>已批改</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label='章节' name={'schoolcourseSectionID'}>
                            <Select allowClear placeholder='请选择章节名称' onChange={() => formRef.current?.submit()}>
                                {chapters.map(v => <Option key={v?.ID} value={v?.ID}>{v?.SectionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Form>,
                    left: <Button type='text' style={{ marginRight: '20px' }} onClick={() => navigate(-1)} icon={<LeftOutlined />} />
                }}
                onChange={(e) =>
                {
                    const tab_key: HomeworkTabs = e as HomeworkTabs;

                    setActiveTab(tab_key);

                    if (!courseSectionID) return;

                    if (tab_key === HomeworkTabs.Submited)
                    {
                        searchHomeworkData({
                            currentPage: 1,
                            courseSectionID,
                            pageSize: PAGE_SIZE,
                        });
                    }

                    if (tab_key === HomeworkTabs.UnSubmited)
                    {
                        searchUnSubmitHomeworkData(courseSectionID);
                    }
                }}
            >
            </Tabs>
            <main>
                {/* TODO 分页 */}
                <Table
                    size='large'
                    rowKey={'ID'}
                    columns={columns}
                    loading={loading}
                    dataSource={homeworkList}
                    showHeader={true}
                    locale={{
                        emptyText:
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='没有相关作业'>
                                <Button type='link' children='返回课程列表' onClick={() => navigate(-1)} />
                            </Empty>
                    }}
                />
            </main>
            <UnsubmittedStudentDetail
                isOpen={isOpen}
                onCancel={() => setOpen(false)}
                courseSectionID={courseSectionID}
                schoolcourseSectionID={sectionID}
            />
        </div>
    );
}
