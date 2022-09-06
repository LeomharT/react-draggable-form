import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DraggableForm from '../pages/DraggableForm';
import { store } from '../redux/store';

export default function App()
{
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path='/draggable_form' element={<DraggableForm />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}
