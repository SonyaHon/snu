import { useEffect, useState } from "react";
import { setMessages, store } from "../../react/store";
import { formatString } from "../../utils/formatter";

export class CMessageDispatcher {
    public state: string[] = [];
    private readonly maxMessages = 8;

    dispatchMessage(message: string) {
        this.state.unshift(message);
        if (this.state.length > this.maxMessages) {
            this.state = this.state.slice(0, this.maxMessages);
        }
        store.dispatch(setMessages([...this.state]));
    }
}

export const MessageDispatcher = new CMessageDispatcher();
//@ts-ignore
window.$messageDispatcher = MessageDispatcher;