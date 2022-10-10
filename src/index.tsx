import 'antd/dist/antd.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/App';
import './assets/scss/index.scss';
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLDivElement);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

export const render = (props: any) =>
{
    console.log(props);
};

//@ts-ignore
if (!window.__POWERED_BY_QIANKUN__)
{
    render({});
}

((global: any) =>
{
    global['purehtml'] = {
        bootstrap: () =>
        {
            console.log('purehtml bootstrap');
            return Promise.resolve();
        },
        mount: (props: any) =>
        {
            return render(props);
        },
        unmount: () =>
        {
            console.log('purehtml unmount');
            return Promise.resolve();
        },
    };
})(window);
