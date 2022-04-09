import React from "react";
import { Box } from "./box";
import { LogMesssage } from "./log-message";
import { selectMessages, useAppSelector } from "./store";

export const GameMessages: React.FC = () => {
    const messages = useAppSelector(selectMessages);

    return <Box title="Messages">
        <div className="bottomRowHeight messageBox">
            {messages.map((msg, index) => <LogMesssage key={index} message={msg} />)}
        </div>
    </Box>
}