import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './reducer';
import rootEpic from './epic';

const epicMiddleware = createEpicMiddleware(rootEpic);
const store = createStore(
    rootReducer, 
    compose(
        applyMiddleware(epicMiddleware), 
        window.devToolsExtension ? window.devToolsExtension() : f => f // 可以使用redux dev tool
    )
);

export default store;