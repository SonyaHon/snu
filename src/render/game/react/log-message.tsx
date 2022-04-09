import React from "react";

export interface ILogMessageProps {
    message: string;
}

export const LogMesssage: React.FC<ILogMessageProps> = ({ message }) => {
    return <span dangerouslySetInnerHTML={{ __html: message }}></span>
}