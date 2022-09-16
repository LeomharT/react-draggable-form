import { MutableRefObject, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateExercise from '../pages/CreateExercise';
import { store } from '../redux/store';
import AppContext, { ExerciseType } from './app-context';

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
                <BrowserRouter>
                    <Routes>
                        <Route path='/create_exercise' element={<CreateExercise />} />
                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        </Provider>
    );
}
