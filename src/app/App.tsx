import { MutableRefObject, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginUserInfo, LoginUserType } from '../@types/login.type';
import CreateExercise from '../pages/CreateExercise';
import MarkHomeWork from '../pages/MarkHomeWork';
import SchoolCourse from '../pages/SchoolCourse';
import AppContext, { ExerciseType } from './app-context';

//@ts-ignore
export const isMicroApp = window.__POWERED_BY_QIANKUN__;

const setBasePath = (): string =>
{
    let base_name = '/';

    if (isMicroApp)
    {
        base_name += 'student_auxiliary_center';
    }
    return base_name;
};

export default function App()
{
    const dispatch = useDispatch();

    const [dragging, setDragging] = useState<boolean>(false);

    const dragType: MutableRefObject<ExerciseType> = useRef(ExerciseType.BLANK);

    useLayoutEffect(() =>
    {
        if (isMicroApp)
        {
            dispatch({
                type: 'setLoginUserInfo',
                payload: {
                    loginName: localStorage.getItem('loginName'),
                    loginType: localStorage.getItem('loginType') as LoginUserType
                } as LoginUserInfo
            });
        }

    }, [dispatch]);

    return (
        <AppContext.Provider value={{
            dragging,
            setDragging,
            dragType,
        }}>
            <BrowserRouter basename={setBasePath()}>
                <Routes>
                    <Route path='/' element={<Navigate to={'/school_course'} />} />
                    <Route path='/create_exercise' element={<CreateExercise />} />
                    <Route path='/school_course' element={<SchoolCourse />} />
                    <Route path='/mark_homework' element={<MarkHomeWork />} />
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    );
}
