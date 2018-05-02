import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import reducers from '../reducers';

const persistConfig = {
  key: 'root',
  stateReconciler: autoMergeLevel2,
  storage: storage,
};

const pR = persistReducer(persistConfig, reducers);

export const store = createStore(pR);
export const persistor = persistStore(store);
