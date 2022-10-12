export const HOST = 'http://localhost:8080/pages/SchoolExercise/SchoolExercise.html';
// export const HOST = 'http://10.22.7.14:32080/pages/SchoolExercise/SchoolExercise.html';

// export const EVAHOST = 'http://10.22.10.63:5000';
export const EVAHOST = 'http://10.22.7.14:32222';


export const REQUEST_URL = {
    getCourseSectionExerciseDetail: `${EVAHOST}/CourseExercise/getCourseSectionExerciseDetail`,
    addCourseExercise: `${EVAHOST}/CourseExercise/addCourseExercise`,
    teacherSearchSchoolCourse: `${EVAHOST}/CourseExercise/TeacherSearchSchoolCourse`,
    studentSearchSchoolCourse: `${EVAHOST}/CourseExercise/StudentSearchSchoolCourse`,
    getClassData: `${EVAHOST}/CourseExercise/getClassData`,
    searchCommitedHomeworkData: `${EVAHOST}/CourseExercise/searchCommitedHomeworkData`,
    getSectionCourse: `${EVAHOST}/CourseExercise/getSectionCourse`,
    getsubmitedStudentData: `${EVAHOST}/CourseExercise/getsubmitedStudentData`,
    getwhetherCompeleSectionCourse: `${EVAHOST}/CourseExercise/getwhetherCompeleSectionCourse`,
    file_upload: `${EVAHOST}/CourseExercise/file_upload`,
    submitHomework: `${EVAHOST}/CourseExercise/submitHomework`,
    getCourseSectionHomeworkDetail: `${EVAHOST}/CourseExercise/getCourseSectionHomeworkDetail`,
    deleteFile: `${EVAHOST}/CourseExercise/deletefile`,
    correctHomework: `${EVAHOST}/CourseExercise/correctHomework`,
    getCourseSections: `${EVAHOST}/getCourseSections`,                               //获取章节
    getUnsubmitedStudent: `${EVAHOST}/CourseExercise/getUnsubmitedStudent`,             //未提交学生列表
    getUnsubmitedStudentDetail: `${EVAHOST}/CourseExercise/getUnsubmitedStudentDetail`,       //未提交学生详情
};
