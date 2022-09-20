import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './assets/scss/index.scss';

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLDivElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
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
