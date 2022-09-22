import { FormOutlined, MoreOutlined, ProfileOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Empty, Menu, Popover, Table, Tabs, Tag } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HomeworkDataItem, SearchCommitedHomeworkParams } from '../@types/exercise-types';
import { searchCommitedHomeworkData } from '../service/exercise';

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

export default function MarkHomeWork()
{
    const navigate = useNavigate();

    const { courseSectionID } = useParams();

    const [homeworkList, setHomeworkList] = useState<HomeworkDataItem[]>([]);

    const onSearchHomworkData = useCallback(async (params: SearchCommitedHomeworkParams) =>
    {
        const res = await searchCommitedHomeworkData(params);

        if (res.code !== 200) return;

        setHomeworkList(res.result.Datas);
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

    return (
        <div className='mark_homework'>
            <Tabs
                size='large'
                items={[
                    { label: '已提交学生', key: 'submitted' },
                    { label: '未提交学生', key: 'unsubmitted' },
                ]}
                tabBarExtraContent={{
                    right:
                        <>
                            <Button>123</Button>
                        </>
                }}
            >
            </Tabs>
            <main>
                <Table
                    columns={columns}
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
