import { Modal, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { HomeworkUnsubmittedDetailDataItem, IResponse } from "../../@types/exercise-types";
import { getUnsubmitedStudentDetail } from "../../service/exercise";


const PAGE_SIZE = 5;

interface UnsubmittedStudentDetailProps
{
    isOpen: boolean;
    courseSectionID: string | undefined;
    schoolcourseSectionID: number | undefined;
    onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default function UnsubmittedStudentDetail(props: UnsubmittedStudentDetailProps)
{
    const { courseSectionID, schoolcourseSectionID } = props;

    /** 当前选中章节的未提交学生数据 */
    const [unSubmittedData, setUnSubmittedData] = useState<HomeworkUnsubmittedDetailDataItem[]>([]);

    const [total, setTotal] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const searchUnSubmitHomeworkDetailData = useCallback(async (pageSize: number, currentPage: number) =>
    {
        if (!courseSectionID || !schoolcourseSectionID) return;

        const res = await getUnsubmitedStudentDetail({
            courseSectionID,
            schoolcourseSectionID,
            pageSize,
            currentPage
        }) as IResponse;

        setUnSubmittedData(res.result.Datas);

        setTotal(res.result.Total);

    }, [courseSectionID, schoolcourseSectionID]);

    useEffect(() =>
    {
        searchUnSubmitHomeworkDetailData(PAGE_SIZE, currentPage);

    }, [searchUnSubmitHomeworkDetailData, currentPage]);

    return (
        <Modal
            open={props.isOpen}
            onCancel={props.onCancel}
            title='未提交学生列表'
            destroyOnClose
            footer={null}

        >
            <Table
                rowKey='studentNumber'
                dataSource={unSubmittedData}
                pagination={{
                    onChange: (e) => setCurrentPage(e),
                    total: total,
                    pageSize: PAGE_SIZE
                }}
                columns={[
                    {
                        title: "学号",
                        dataIndex: 'studentNumber',
                        key: 'studentNumber'
                    }, {
                        title: "学生姓名",
                        dataIndex: 'studentName',
                        key: 'studentName'
                    },
                ]}
            />
        </Modal>
    );
}
