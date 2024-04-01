/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { createAction, createAsyncThunk, createReducer, Middleware } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { saveAs } from 'file-saver';
import { AnyAction, Reducer } from 'redux';
import { texts } from '@app/const';
import { EditorState, EditorStateInStore, LoadingState, Serializer, UndoableState } from './../internal';
import { fetchDiagram } from './api';
import { addDiagram, selectDiagram } from './diagrams';
import { selectItems } from './items';
import { migrateOldAction } from './obsolete';
import { showToast } from './ui';

export const newDiagram =
    createAction('diagram/new', (navigate: boolean) => {
        return { payload: { navigate } };
    });

export const loadDiagramFromFile =
    createAsyncThunk('diagram/load/file', async (args: { file: File }) => {
        const stored = JSON.parse(await args.file.text());

        return { stored };
    });

export const loadDiagramFromServer =
    createAsyncThunk('diagram/load/server', async (args: { tokenToRead: string; tokenToWrite?: string; navigate: boolean }) => {
        const stored = await fetchDiagram(args.tokenToRead);

        return { tokenToRead: args.tokenToRead, tokenToWrite: args.tokenToWrite, stored };
    });

export const loadDiagramInternal =
    createAction('diagram/load/actions', (stored: any, requestId: string) => {
        return { payload: { stored, requestId } };
    });

export const downloadDiagramToFile = 
    createAsyncThunk('diagram/save/file', async (_, thunkAPI) => {
        const state = thunkAPI.getState() as EditorStateInStore;

        const bodyText = JSON.stringify(getSaveState(state), undefined, 4);
        const bodyBlob = new Blob([bodyText], { type: 'application/json' });

        saveAs(bodyBlob, 'diagram.json');
    });

export function loadingMiddleware(): Middleware {
    const middleware: Middleware = store => next => action => {        
        if (loadDiagramFromServer.pending.match(action) ||  loadDiagramFromFile.pending.match(action)) {
            store.dispatch(showToast(texts.common.loadingDiagram, 'loading', action.meta.requestId));
        }

        try {
            const result = next(action);

            if (newDiagram.match(action) ) {
                if (action.payload.navigate) {
                    store.dispatch(push(''));
                }
            } else if (loadDiagramFromServer.fulfilled.match(action)) {
                if (action.meta.arg.navigate) {
                    store.dispatch(push(action.payload.tokenToRead));
                }
                
                store.dispatch(loadDiagramInternal(action.payload.stored, action.meta.requestId));
            } else if (loadDiagramFromFile.fulfilled.match(action)) {
                store.dispatch(loadDiagramInternal(action.payload.stored, action.meta.requestId));
            } else if (loadDiagramFromServer.rejected.match(action) ||  loadDiagramFromFile.rejected.match(action)) {
                store.dispatch(showToast(texts.common.loadingDiagramFailed, 'error', action.meta.requestId));
            } else if (loadDiagramInternal.match(action)) {
                store.dispatch(showToast(texts.common.loadingDiagramDone, 'success', action.payload.requestId));
            } else if (downloadDiagramToFile.fulfilled.match(action)) {
                store.dispatch(showToast(texts.common.savingDiagramDone, 'success', action.meta.requestId));
            }

            return result;
        } catch (ex) {
            if (loadDiagramInternal.match(action)) {
                store.dispatch(showToast(texts.common.loadingDiagramFailed, 'error', action.payload.requestId));
            }
            
            console.error(ex);
            throw ex;
        }
    };

    return middleware;
}

export function loading(initialState: LoadingState) {
    return createReducer(initialState, builder => builder
        .addCase(newDiagram, (state) => {
            state.isLoading = false;
            state.tokenToRead = null;
            state.tokenToWrite = null;
        })
        .addCase(loadDiagramFromServer.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(loadDiagramFromServer.rejected, (state) => {
            state.isLoading = false;
        })
        .addCase(loadDiagramFromServer.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tokenToRead = action.payload?.tokenToRead;
            state.tokenToWrite = action.payload?.tokenToWrite;
        }));
}

export function rootLoading(undoableReducer: Reducer<UndoableState<EditorState>>, editorReducer: Reducer<EditorState>): Reducer<any> {
    return (state: any, action: any) => {
        if (newDiagram.match(action)) {
            const initialAction = addDiagram();
            const initialState = editorReducer(EditorState.create(), initialAction);

            state = UndoableState.create(initialState, initialAction);
        } else if (loadDiagramInternal.match(action)) {
            const stored = action.payload.stored;

            let initialState: EditorState;

            if (stored.initial) {
                initialState = Serializer.deserializeEditor(stored.initial);
            } else {
                initialState = EditorState.create();
            }

            const actions: AnyAction[] = stored.actions || stored;

            let firstAction = actions[0];

            if (!firstAction) {
                firstAction = addDiagram();
            }

            let editor = UndoableState.create(editorReducer(initialState, firstAction), firstAction);

            for (const loadedAction of actions.slice(1).filter(handleAction)) {
                editor = undoableReducer(editor, migrateOldAction(loadedAction));
            }

            const selectedDiagram = editor.present.diagrams.get(editor.present.selectedDiagramId!);

            if (!selectedDiagram) {
                const firstDiagram = editor.present.orderedDiagrams[0];

                if (firstDiagram) {
                    editor = undoableReducer(editor, selectDiagram(firstDiagram));
                }
            }

            state = editor;
        }

        return undoableReducer(state, action);
    };
}

function getSaveState(state: EditorStateInStore) {
    const initial = Serializer.serializeEditor(state.editor.firstState);
    const actions = state.editor.actions.slice(1).filter(handleAction);

    return { initial, actions };
}

function handleAction(action: AnyAction) {
    return !selectItems.match(action) && !selectDiagram.match(action);
}