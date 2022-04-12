import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Glyph } from "../core/components/glyph";
import { Named } from "../core/components/named";

export type ISeenEntityEntry = {
    icon: string,
    fg: string,
    bg: string,
    name: string,
};

export interface MainState {
    messages: string[];
    mapName: string;
    seenEntities: {
        creatures: ISeenEntityEntry[],
    };
}

const initialState: MainState = {
    messages: [],
    mapName: '',
    seenEntities: {
        creatures: [],
    },
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
        },
        setSeenEntities: (state, action: PayloadAction<MainState['seenEntities']>) => {
            state.seenEntities = action.payload;
        }
    },
})

export const { setMessages, setMapName, setSeenEntities } = mainSlice.actions;

export const selectMessages = (state: RootState) => state.main.messages;
export const selectMapName = (state: RootState) => state.main.mapName;
export const selectSeenEntities = (state: RootState) => state.main.seenEntities;

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