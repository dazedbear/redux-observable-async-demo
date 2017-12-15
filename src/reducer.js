import {
    START_PROCESS,
    GET_ENDPOINT,
    GET_ENDPOINT_SUCCESS,
    GET_ENDPOINT_FAILED,
    GET_TOKEN,
    GET_TOKEN_SUCCESS,
    GET_TOKEN_FAILED,
    
    PROCESS_SUCCESS,
    PROCESS_FAILED,
} from './actionTypes';

const initState = {
    pid: 12345678,
    token: null,
    endpoint: null,
    data: {},
    status: 'initial',
    trackStage: [],
};

const reducer = (state = initState, action) => {
    let newStage = [];
    switch(action.type){
        case START_PROCESS: 
        case GET_ENDPOINT:
        case GET_TOKEN:
            newStage = [...state.trackStage, action.type];
            return Object.assign({}, state, { 
                trackStage: newStage,
                status: 'pending'
            });

        case GET_ENDPOINT_FAILED:
        case GET_TOKEN_FAILED:
        case PROCESS_FAILED:
            return Object.assign({}, state, { status: 'error' });
        
        case GET_ENDPOINT_SUCCESS:
            return Object.assign({}, state, { 
                endpoint: action.payload.endpoint,
                status: 'complete'
            });

        case GET_TOKEN_SUCCESS:
            return Object.assign({}, state, { 
                token: action.payload.token,
                status: 'complete',
            });
        
        case PROCESS_SUCCESS:
        newStage = [...state.trackStage, action.type];
            return Object.assign({}, state, { 
                trackStage: newStage,
                isProcessSuccess: true 
            });

        default:
            return state;
    }
};

export default reducer;