import { configureStore } from '@reduxjs/toolkit'
import {authApi} from './services/auth'
export const store=configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware)=>{
        return getDefaultMiddleware().concat(authApi.middleware)
    }
  })
