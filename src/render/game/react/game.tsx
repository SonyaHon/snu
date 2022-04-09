import React, { useEffect } from 'react';
import { GameDisplay } from './game-display';
import { GameAttrs } from './game-attrs';
import { GameMessages } from './game-messages';
import { WhatsAround } from './whats-around';
import { Status } from './status';
import {Game as GameCore} from '../core/game';

export const Game: React.FC = () => {
    useEffect(() => {
        setTimeout(() => {
            GameCore.loop();
        }, 100);
        
    }, [])
    return <div className='game'>
        <div className='twoThirds'>
            <GameDisplay />
            <GameAttrs />
            <GameMessages />
        </div>
        <div className='oneThird'>
            <WhatsAround />
            <Status />
        </div>
    </div>
}