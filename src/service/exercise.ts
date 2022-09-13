import { REQUESTURL } from "../data/requests";

export const fetchExeriseDetail = async () =>
{
    const res = await fetch(REQUESTURL.addCourseExercise);
};
