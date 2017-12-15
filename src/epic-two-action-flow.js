import { combineEpics } from 'redux-observable';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import {
    getEndPoint,
    getEndPointSuccess,
    getEndPointFailed,
    getToken,
    getTokenSuccess,
    getTokenFailed,
    processSuccess,
    processFailed,
} from './action';
import {
    START_PROCESS,
    GET_ENDPOINT,
    GET_TOKEN,
    GET_ENDPOINT_SUCCESS,
    GET_TOKEN_SUCCESS,
} from './actionTypes';

/* API calls */
const fetchPromise = (url) => {
    if (!url) return { ok: false, msg: 'no valid url' };
    return fetch(url)
        .then(res => res.ok ? res.json() : Promise.reject({ msg: 'request error', res }))
        .then(data => ({ ok: true, ...data}))
        .catch(err => err);
}

/**
 * Main Process
 * in: START_PROCESS
 * out: PROCESS_SUCCESS or PROCESS_FAILED
 * 
 * TODO: 這種做法另開一條封裝過的 action flow，用 mergeMap 比喻成 promise 的 then 去接，並可以用 catch 處理錯誤
 * FIXME: 明顯的缺點就是難以 debug ，redux action 裡面看不到這條 action flow，並且需要手動呼叫 epic
 *        建議純功能的子 epic 改成 function 比較好
 */ 

const startProcessEpic = ( action$, store ) => z$
    .ofType(START_PROCESS)
    .mergeMap(action => Observable
        .of(store.dispatch(getEndPoint()))
        .mergeMap((action) => {
            console.log('1st dispatch action', action);
            return getEndPointEpic(Observable.of(action));
        })
        .mergeMap((action) => {
            console.log('1st receive action', action);
            return (action.type === GET_ENDPOINT_SUCCESS)
                ? Observable.of(processSuccess())
                : Observable.throw(processFailed());
        })
        /* .mergeMap((action) => {
            console.log('2nd dispatch action', action);
            return getTokenEpic(Observable.of(action));
        })
        .mergeMap((action) => {
            console.log('2nd receive action', action);
            return (action.type !== GET_TOKEN_SUCCESS)
                ? Observable.of(processSuccess())
                : Observable.throw(processFailed());
        }) */
        .catch(err => {
            console.log('process error', err);
            return Observable.of(err);
        })
);

/**
 * in: GET_ENDPOINT
 * out: 
 *   成功：GET_ENDPOINT_SUCCESS
 *   失敗：GET_ENDPOINT_FAILED
 */
const getEndPointEpic = (action$, store) => action$
    .filter(action => action.type === GET_ENDPOINT)
    .mergeMap(action => {
        const endpointPromise = new Promise(res => {
            setTimeout(() => res(getEndPointSuccess()), 5000);
        })
        return Observable.from(endpointPromise);

        /* return Observable
            .from(fetchPromise('http://localhost:5000/getEndPoint'))
            .mergeMap(res => {
                const state = store.getState();
                if (!state.pid) return Observable.of(getEndPointFailed({ ...res, ...state }, 'cannot find pid'));

                return Observable.of(
                    (res.ok) ? getEndPointSuccess(res.endpoint) : getEndPointFailed(res, 'getEndpoint error')
                );
            }); */
    })

/**
 * in: GET_TOKEN
 * out: 
 *   成功：GET_TOKEN_SUCCESS
 *   失敗：GET_TOKEN_FAILED
 */ 
/* const getTokenEpic = (action$, store) => action$
    .filter(action => action.type === GET_TOKEN)
    .mergeMap(action => {
        const state = store.getState();
        const endpoint = state.endpoint;

        if (!endpoint) return Observable.of(getTokenFailed(endpoint, 'getTokenEpic error: cannot find endpoint'))
        return Observable
            .from(fetchPromise(endpoint))
            .mergeMap(res => Observable.of(
                (res.ok) ? getTokenSuccess(res.token) : getTokenFailed(res, 'getToken error'))
            );
    }) */

const rootEpic = combineEpics(
    startProcessEpic,
);

export default rootEpic;
