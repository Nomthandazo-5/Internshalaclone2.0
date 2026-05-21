import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage"; 
import userslice from "../Feature/Userslice"; 

const persistConfig = {
  key: "root",
  storage, 
  whitelist: ["user"], 
};
const persistedReducer = persistReducer(persistConfig, userslice);
export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});
export const persistor = persistStore(store);