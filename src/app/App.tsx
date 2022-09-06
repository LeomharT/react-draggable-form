import { Button } from 'antd';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from '../redux/store';

export default function App()
{
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={
                        <div>
                            <Button>Hello</Button>
                        </div>
                    } />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}
