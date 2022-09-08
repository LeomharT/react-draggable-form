import { useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DraggableForm from '../pages/DraggableForm';
import { store } from '../redux/store';
import AppContext from './app-context';

export default function App()
{

    const [dragging, setDragging] = useState<boolean>(false);

    return (
        <Provider store={store}>
            <AppContext.Provider value={{
                dragging,
                setDragging
            }}>
                <BrowserRouter>
                    <Routes>
                        <Route path='/draggable_form' element={<DraggableForm />} />
                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        </Provider>
    );
}
