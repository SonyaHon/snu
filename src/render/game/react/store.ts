import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export interface MainState {
    messages: string[];
    mapName: string;
}

const initialState: MainState = {
    messages: [],
    mapName: '',
}

export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<string[]>) => {
            state.messages = action.payload;
        },
        setMapName: (state, action: PayloadAction<string>) => {
            state.mapName = action.payload;
        }
    },
})

export const { setMessages, setMapName } = mainSlice.actions;

export const selectMessages = (state: RootState) => state.main.messages;
export const selectMapName = (state: RootState) => state.main.mapName;

export const mainReducer = mainSlice.reducer;

export const store = configureStore({
    reducer: {
        main: mainReducer
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;