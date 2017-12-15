import { combineEpics } from 'redux-observable';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import {
    getEndPoint,
    getEndPointSuccess,
    processSuccess,
    processFailed,
    getToken,
    getTokenSuccess,
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
 * in: GET_ENDPOINT
 * out: 
 *   成功：GET_ENDPOINT_SUCCESS
 *   失敗：GET_ENDPOINT_FAILED
 */ 
const getEndPointEpic = action$ => action$
    .ofType(GET_ENDPOINT)
    .mergeMap(action => {
        const endpointPromise = new Promise(res => {
            setTimeout(() => res(getEndPointSuccess()), 5000);
        })
        return Observable.from(endpointPromise);
    })

/**
 * in: GET_TOKEN
 * out: 
 *   成功：GET_TOKEN_SUCCESS
 *   失敗：GET_TOKEN_FAILED
 */ 
const getTokenEpic = action$ => action$
    .ofType(GET_TOKEN)
    .mergeMap(action => {
        const tokenPromise = new Promise(res => {
            setTimeout(() => res(getTokenSuccess()), 2000);
        })
        return Observable.from(tokenPromise);
    })

/**
 * Main Process
 * in: START_PROCESS
 * out: GET_ENDPOINT
 * 
 * TODO: 接收流程中會用到的所有 action 並只負責轉發送 action
 * FIXME: 當有多個 process 時，共用一樣的子epic會互相干擾，建議純功能的子 epic 改用 function 取代
 */ 
const startProcessEpic = action$ => action$
    .filter(action => {
        const acceptList = [START_PROCESS, GET_ENDPOINT_SUCCESS, GET_TOKEN_SUCCESS];
        return acceptList.indexOf(action.type) !== -1;
    })
    .map(action => {
        switch(action.type){
            case START_PROCESS:
                return getEndPoint();
            case GET_ENDPOINT_SUCCESS:
                return getToken();
            case GET_TOKEN_SUCCESS:
                return processSuccess();
            // FIXME: 暫時想不到 default 怎麼解
        }
    })

// TODO: 所有子epic都需要註冊在 root epic
const rootEpic = combineEpics(
    startProcessEpic,
    getEndPointEpic,
    getTokenEpic,
);

export default rootEpic;
