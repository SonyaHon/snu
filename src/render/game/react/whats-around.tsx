import React from "react";
import { Box } from "./box";
import { selectSeenEntities, useAppSelector } from "./store";

export const WhatsAround: React.FC = () => {
    const seenEntities = useAppSelector(selectSeenEntities);

    return <Box title="Whats around" className="unmargin fullHeight">
        <div className="fullHeight">
            <Box title="Creatures">
                {seenEntities.creatures.length &&
                    seenEntities.creatures.map(({ name, icon, fg, bg }, index) => {
                        return <div key={index}>
                            <span style={{ color: fg, background: bg }}>{icon}</span>
                            <span>-</span>
                            <span>{name}</span>
                        </div>
                    })}
                {seenEntities.creatures.length < 1 && 'There is nothing around.'}
            </Box>
        </div>
    </Box>
}