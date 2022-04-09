import React from "react";
import { Game } from "./game/react/game";

export const App: React.FC = () => {
    return <div className="root">
        <Game />
    </div>;
}