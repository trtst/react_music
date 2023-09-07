import React, { createContext, useRef, useState } from 'react';
import Audio from './audio';
import StripBar from './stripbar';
import sty from './scss/index.module.scss';

const PLAYBAR = createContext();

export default function PlayBar() {
    const [ curTime, setCurTime ] = useState(0);
    const audioRef = useRef();

    return (
        <div className={sty.playbar_main}>
            <PLAYBAR.Provider value={{ curTime, setCurTime }}>
                <>
                    <Audio ctx={PLAYBAR} ref={audioRef} />
                    <StripBar ctx={PLAYBAR} ref={audioRef} />
                </>
            </PLAYBAR.Provider>
        </div>
    )
}
