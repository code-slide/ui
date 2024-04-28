/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

/* eslint-disable @typescript-eslint/indent */

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import { registerServiceWorker } from './registerServiceWorker';
import './index.scss';
import { store } from './store';

const Root = (
    <DndProvider backend={HTML5Backend}>
        <Provider store={store}>
            <App />
        </Provider>
    </DndProvider>
);

registerServiceWorker(store);

ReactDOM.render(Root, document.getElementById('root-layout') as HTMLElement);
