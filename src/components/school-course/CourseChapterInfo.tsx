import { Button, Form, Input, Modal, TreeSelect } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CourseChapter } from "../../@types/course-types";
import { IResponse } from "../../@types/exercise-types";
import { HOST } from "../../data/requests";
import { loginUserInfoSelector } from "../../redux/selector";
import { getCourseSections } from "../../service/course";

export interface CourseChapterInfoProps
{
    ID: number;
    isOpen: boolean;
    courseName: string;
    onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const arrayToTree = (chapters: CourseChapter[]) =>
{
    const result = [];

    const tree_map = {};

    for (const c of chapters)
    {
        const id = c.ID;
        const pid = c.ParentId;

        if (!tree_map[id])
        {
            tree_map[id] = {
                children: []
            };
        }

        tree_map[id] = {
            key: c.ID,
            value: c.ID,
            title: c.SectionName,
            ...c,
            children: tree_map[id]['children']
        };

        const tree_item = tree_map[id];

        if (pid === 0)
        {
            result.push(tree_item);
        } else
        {
            if (!tree_map[pid])
            {
                tree_map[pid] = {
                    children: []
                };
            }
            tree_map[pid].children.push(tree_item);
        }
    }

    return result;
};

const treeToArray = (chapters: CourseChapter[], result: CourseChapter[]) =>
{
    for (const c of chapters)
    {
        result.push(c);
        if (c.Children)
        {
            treeToArray(c.Children, result);
        }
    }
};

const setTreeComponent = (chapters: CourseChapter[]) =>
{
    const tree_data = arrayToTree(chapters);

    return tree_data;
};


export default function CourseChapterInfo(props: CourseChapterInfoProps)
{
    const { ID, isOpen } = props;

    const userInfo = useSelector(loginUserInfoSelector);

    /** 章节列表-树型结构 */
    const [chapterList, setChapterList] = useState<CourseChapter[]>([]);

    /** 一维数据 */
    const [planList, setPlanList] = useState<CourseChapter[]>([]);

    /** 当前选择的章节数据 */
    const [currSelect, setCurrentSelect] = useState<CourseChapter | undefined>(undefined);

    const setCourseSections = useCallback(async (ID: number) =>
    {
        const res = await getCourseSections(ID) as IResponse;

        if (res.msg !== 'success') return;

        const plan_data: CourseChapter[] = [];

        treeToArray(res.result as CourseChapter[], plan_data);

        setPlanList(plan_data);

        const tree_data = setTreeComponent(plan_data);

        setChapterList(tree_data);
    }, []);


    useEffect(() =>
    {
        if (!isOpen) return;

        setCourseSections(ID);

    }, [ID, isOpen, setCourseSections]);

    return (
        <Modal
            className="course-chapter-info"
            open={props.isOpen}
            onCancel={props.onCancel}
            destroyOnClose
            footer={null}
        >
            <Form layout="horizontal">
                <Form.Item label='章节'>
                    <TreeSelect
                        treeData={chapterList}
                        treeDefaultExpandAll
                        placeholder='请选择章节'
                        onChange={(e) =>
                        {
                            const curr_select = planList.find(v => v.ID === e);
                            setCurrentSelect(curr_select);
                        }}
                    />
                </Form.Item>
                <Form.Item label='章节说明' >
                    <Input readOnly value={currSelect?.SectionRemark} />
                </Form.Item>
                <Form.Item label='章节资源' >
                    <Input readOnly value={currSelect?.SectionRemarkUrl} />
                </Form.Item>
                <Form.Item label='课件PDF'>
                    <Input readOnly value={currSelect?.CaseAnnexHtmlUrl} />
                </Form.Item>
                <Form.Item label='实验环境' >
                    <Input readOnly value={currSelect?.WaffleUrl} />
                </Form.Item>
                <Form.Item label='配套案例' >
                    <Input readOnly value={currSelect?.CaseUrl} />
                </Form.Item>
                <Form.Item label='配套资源' >
                    <Input readOnly value={currSelect?.CodelabId} />
                </Form.Item>
                <Form.Item label='配套视频' >
                    <Input readOnly value={currSelect?.CourseVideoUrl} />
                </Form.Item>
                <Form.Item label='配套PPT' >
                    <Input readOnly value={currSelect?.CoursePPtUrl} />
                </Form.Item>
                <Button type="primary" disabled={currSelect === undefined} onClick={() =>
                {
                    if (!currSelect) return;

                    const url = `${HOST}/create_exercise?school_course_id=${ID}&school_courseName=${props.courseName}&school_course_sectionId=${currSelect.ID}&school_course_sectionName=${currSelect.SectionName}&login_name=${userInfo.loginName}`;

                    window.open(url, '_blank');
                }}>
                    创建作业
                </Button>
            </Form>
        </Modal>
    );
}
