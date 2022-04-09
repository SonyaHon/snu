import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { DisplayManager } from "../core/display";
import { Box } from "./box";
import { selectMapName } from "./store";

export const GameDisplay: React.FC = () => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) return;
        const container = DisplayManager.getContainer();
        if (!container) return;
        divRef.current.appendChild(container);
        const { width, height } = divRef.current.getBoundingClientRect();
        DisplayManager.setDimensions(width, height);
    }, [divRef]);

    const mapName = useSelector(selectMapName);

    return <Box title={mapName} className="fullHeight">
        <div className="fullHeight centeredContent" ref={divRef}></div>
    </Box>
}