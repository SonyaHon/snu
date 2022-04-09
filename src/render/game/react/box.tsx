import React from "react"

export interface IBoxProps {
    title: string;
    className?: string;
}

export const Box: React.FC<IBoxProps> = ({ children, title, className }) => {
    return <div className={`boxed${className ? ` ${className}` : ''}`}>
        <div className="box-title">{title}</div>
        <div className="lt">*</div>
        <div className="lb">*</div>
        <div className="rt">*</div>
        <div className="rb">*</div>
        {children}
    </div>
}