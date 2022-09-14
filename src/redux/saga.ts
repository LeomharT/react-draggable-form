import createSagaMiddleware from "redux-saga";
import { all } from 'redux-saga/effects';


export function* rootSaga()
{
    yield all([

    ]);
}

export const sagaMiddleware = createSagaMiddleware();
