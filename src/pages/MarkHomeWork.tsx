import { FormOutlined, MoreOutlined, ProfileOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Empty, Form, FormInstance, Menu, Popover, Select, Table, Tabs, Tag } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HomeworkDataItem, SearchCommitedHomeworkParams } from '../@types/exercise-types';
import { getSectionCourse, getsubmitedStudentData, searchCommitedHomeworkData } from '../service/exercise';

const PAGE_SIZE = 20;


const columns: ColumnType<HomeworkDataItem>[] = [
    {
        title: '所属章节',
        dataIndex: 'SectionName',
        key: 'SectionName',
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: '作业状态',
        dataIndex: 'CorrectStatus',
        key: 'CorrectStatus',
        render: (data: number) => data === 1 ? <Tag color='error'>未批改</Tag> : <Tag color='success'>已批改</Tag>
    },
    {
        title: '作业分数',
        dataIndex: 'Score',
        key: 'Score',
    },
    {
        title: '提交时间',
        dataIndex: 'SubmitDate',
        key: 'SubmitDate',
    },
    {
        title: '学生',
        dataIndex: 'SubmitStudentId',
        key: 'SubmitStudentId',
    },
    {
        title: '操作',
        dataIndex: 'Action',
        key: 'Action',
        render: () =>
        {
            return (
                <Popover
                    content={
                        <Menu mode='vertical' className='popover-menu' items={[
                            { label: '批改作业', key: "mark", icon: <FormOutlined /> },
                            { label: '重新批改', key: "remark", icon: <RedoOutlined /> },
                            { label: '详情', key: "detail", icon: <ProfileOutlined /> },
                        ]}>
                        </Menu>
                    }
                    trigger='focuse'
                    showArrow={false}
                    placement='bottomRight'
                >
                    <Button icon={<MoreOutlined />} type='text' />
                </Popover>
            );
        }
    }
];

const { Option } = Select;

export default function MarkHomeWork()
{
    const navigate = useNavigate();

    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);

    const { courseSectionID } = useParams();

    const [homeworkList, setHomeworkList] = useState<HomeworkDataItem[]>([]);

    const [chapters, setChapters] = useState<any[]>([]);

    const [submittedStd, setSubmittedStd] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const onSearchHomworkData = useCallback(async (params: SearchCommitedHomeworkParams) =>
    {
        setLoading(true);

        const res = await searchCommitedHomeworkData(params);

        if (res.code !== 200) return;

        setHomeworkList(res.result.Datas);

        setLoading(false);
    }, []);

    useEffect(() =>
    {
        if (!courseSectionID) return;

        onSearchHomworkData({
            currentPage: 1,
            courseSectionID,
            pageSize: PAGE_SIZE,
        });

    }, [courseSectionID, onSearchHomworkData]);

    useEffect(() =>
    {
        if (!courseSectionID) return;

        getSectionCourse(courseSectionID).then(data =>
        {
            setChapters(data.result);
        });

    }, [courseSectionID]);

    useEffect(() =>
    {
        if (!courseSectionID) return;

        getsubmitedStudentData().then(data =>
        {
            setSubmittedStd(data.result);
        });

    }, [courseSectionID]);

    return (
        <div className='mark_homework'>
            <Tabs
                size='large'
                items={[
                    { label: '已提交学生', key: 'submitted' },
                    // { label: '未提交学生', key: 'unsubmitted' },
                ]}
                tabBarExtraContent={{
                    right:
                        <Form ref={formRef} layout='inline' onFinish={e =>
                        {
                            if (!courseSectionID) return;

                            onSearchHomworkData({
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
                            <Form.Item label='章节' name={'courseSectionID'}>
                                <Select allowClear placeholder='请选择章节名称' onChange={() => formRef.current?.submit()}>
                                    {chapters.map(v => <Option key={v?.ID} value={v?.ID}>{v?.SectionName}</Option>)}
                                </Select>
                            </Form.Item>
                        </Form>
                }}
            >
            </Tabs>
            <main>
                {/* TODO 分页 */}
                <Table
                    columns={columns}
                    loading={loading}
                    size='large'
                    rowKey={'ID'}
                    dataSource={homeworkList}
                    showHeader={true}
                    locale={{
                        emptyText:
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='没有相关作业'>
                                <Button type='link' children='返回课程列表' onClick={() => navigate('/school_course')} />
                            </Empty>
                    }}
                />
            </main>
        </div >
    );
}
