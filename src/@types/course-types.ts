export interface SchoolCourseItem
{
    ClassName: string;
    ClassSize: number;
    CourseCoverUrl: string;
    CourseLevel: number;
    CourseName: string;
    ID: number;
    SchoolId: number;
    StandardCourseId: number;
    State: number;
    TeacherName: string;
    SubmitedCount: number;
    CorrectedCount: number;
}


export interface ClassFilter
{
    ClassName: string;
    EnterDate: string;
    EnterPerson: number;
    Grade: string;
    ID: number;
    SchoolId: string;
    Session: string;
    State: 1;
}



export interface CourseChapter
{
    CaseAnnexHtmlUrl: string;
    CaseAnnexUrl: string;
    CaseType: string;
    CaseUrl: string;
    Children: CourseChapter[];
    CodelabId: string;
    CoursePPtUrl: string;
    CourseVideoUrl: string;
    CoursewarePdfUrl: string;
    ExampleAnnexHtmlUrl: string;
    ExampleAnnexUrl: string;
    ExampleRemark: string;
    ExampleTitle: string;
    ID: number;
    ParentId: number;
    RefId: string;
    SchoolCourseId: number;
    SchoolCoursewarePdfUrl: string;
    SectionName: string;
    SectionRemark: string;
    SectionRemarkUrl: string;
    Sorting: number;
    WaffleUrl: string;
}
