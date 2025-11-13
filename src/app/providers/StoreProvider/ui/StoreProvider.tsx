import {ReactNode} from 'react';
import {Provider} from 'react-redux';
import {configureStore, DeepPartial} from '@reduxjs/toolkit';
import {RootStore} from '../config/types';
import {optionSelectorReducer} from "../../../../entities/OptionSelector";

interface StoreProviderProps {
    children?: ReactNode;
    initialState?: DeepPartial<RootStore>;
}

export const StoreProvider = (props: StoreProviderProps) => {
    const {children, initialState} = props;

    const store = configureStore({
        reducer: {
            optionSelector: optionSelectorReducer,
        },
        preloadedState: initialState as any,
    });

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};