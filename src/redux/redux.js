import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'

import { CollApsedReducer } from './reducers/CollapsedReducer'

import { LoadingReducer } from './reducers/LoadingReducer'

import thunk from 'redux-thunk'

import { composeWithDevTools } from 'redux-devtools-extension'


import { persistStore, persistReducer } from 'redux-persist'

import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'chz_root',
  storage,
  blacklist: ['LoadingReducer'] //? 不会持久化LoadingReducer
}

const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer
})
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))
const persistor = persistStore(store)

export { store, persistor }
