import {configureStore} from '@reduxjs/toolkit';
import {optionSelectorReducer} from "../../../../entities/OptionSelector";

export const store = configureStore({
    reducer: {
        optionSelector: optionSelectorReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;