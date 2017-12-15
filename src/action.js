import * as actionTypes from './actionTypes';

export const startProcess = () => {
    return {
        type: actionTypes.START_PROCESS,
        payload: {}
    }
}

export const getEndPoint = () => {
    return {
        type: actionTypes.GET_ENDPOINT,
        payload: {}
    }
}

export const getEndPointSuccess = (endpoint) => {
    return {
        type: actionTypes.GET_ENDPOINT_SUCCESS,
        payload: {
            endpoint
        }
    }
}

export const getEndPointFailed = (raw, msg = 'getEndPoint error') => {
    return {
        type: actionTypes.GET_ENDPOINT_FAILED,
        error: {
            msg,
            raw
        }
    }
}

export const getToken = (pid) => {
    return {
        type: actionTypes.GET_TOKEN,
        payload: {
            pid,
        }
    }
}

export const getTokenSuccess = (token) => {
    return {
        type: actionTypes.GET_TOKEN_SUCCESS,
        payload: {
            token,
        }
    }
}

export const getTokenFailed = (raw, msg = 'getToken error') => {
    return {
        type: actionTypes.GET_TOKEN_FAILED,
        error: {
            msg,
            raw
        }
    }
}

export const processSuccess = (res) => {
    return {
        type: actionTypes.PROCESS_SUCCESS,
        payload: {
            ...res,
        }
    }
}

export const processFailed = (raw, msg = 'process error') => {
    return {
        type: actionTypes.PROCESS_FAILED,
        error: {
            msg,
            raw,
        }
    }
}
