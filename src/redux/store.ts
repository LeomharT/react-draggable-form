import { Action, applyMiddleware, compose, createStore } from 'redux';
import { rootReduser } from './reducer';
import { sagaMiddleware } from './redux-saga';

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

export type ActionProps<T, P> = Action<T> & {
    payload: P;
};

/** Redux 仓库 */
export const store = createStore(
    rootReduser,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
);
