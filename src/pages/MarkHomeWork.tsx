import { Empty, Tabs } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function MarkHomeWork()
{
    const { courseSectionID } = useParams();

    useEffect(() =>
    {
        console.log(courseSectionID);
    }, []);

    return (
        <div className='mark_homework'>
            <Tabs size='large' items={[
                { label: '已提交学生', key: 'submitted' },
                { label: '未提交学生', key: 'unsubmitted' },
            ]}>
            </Tabs>
            <main>
                {!courseSectionID && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='没有相关作业' />}
            </main>
        </div >
    );
}
