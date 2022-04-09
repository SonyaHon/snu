import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { App } from "./App";
import { store } from "./game/react/store";

import './index.css';
import './game/core/resources/message-dispatcher';

const container = document.createElement('div');
container.classList.add('root');
document.body.appendChild(container);
const root = createRoot(container);


root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

