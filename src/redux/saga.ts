import createSagaMiddleware, { SagaIterator } from "redux-saga";
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { ExerciseComponentType } from "../@types/ExerciseComponentTypes";
import { fetchExeriseDetail } from "../service/exercise";
import { ActionProps } from "./store";

export function* fetchExeriseDetailSaga(): SagaIterator
{
    try
    {
        yield put({
            type: 'fetchExeriseDetailSuccess',
            payload: yield call(fetchExeriseDetail)
        } as ActionProps<string, ExerciseComponentType[]>);
    } catch (err: any)
    {
        yield put({
            type: 'fetchExeriseDetailFail',
            payload: { message: err.message }
        } as ActionProps<string, any>);
    }
}


export function* rootSaga()
{
    yield all([
        call(function* ()
        {
            yield takeEvery('fetchExeriseDetail', fetchExeriseDetailSaga);
        })
    ]);
}

export const sagaMiddleware = createSagaMiddleware();
