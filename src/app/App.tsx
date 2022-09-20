import { MutableRefObject, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CreateExercise from '../pages/CreateExercise';
import MarkHomeWork from '../pages/MarkHomeWork';
import SchoolCourse from '../pages/SchoolCourse';
import { store } from '../redux/store';
import AppContext, { ExerciseType } from './app-context';

const setBasePath = (): string =>
{
    let base_name = '/';

    //@ts-ignore
    if (window.__POWERED_BY_QIANKUN__)
    {
        base_name += 'student_auxiliary_center';
    }
    return base_name;
};

export default function App()
{
    const [dragging, setDragging] = useState<boolean>(false);

    const dragType: MutableRefObject<ExerciseType> = useRef(ExerciseType.BLANK);

    return (
        <Provider store={store}>
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
        </Provider>
    );
}
