import React from 'react';
import './index.scss';
import {OptionSelector} from './entities/OptionSelector';
import {StoreProvider} from "./app/providers/StoreProvider";

const App = () => {
    return (
        <div className="app">
            <StoreProvider>
                <OptionSelector/>
            </StoreProvider>
        </div>
    );
};

export default App;
