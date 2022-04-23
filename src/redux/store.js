import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import auth from './reducers/auth';
import userStore from './reducers/userStore';

export default function configureStore(isDebug = false) {
  const rootReducer = combineReducers({auth, userStore});
  const extraComposer = [];
  if (isDebug) {
    const Reactotron = require('../../dev/ReactotronConfig').default;
    extraComposer.push(Reactotron.createEnhancer());
  }
  return createStore(
    rootReducer,
    {},
    compose(applyMiddleware(thunkMiddleware), ...extraComposer),
  );
}
