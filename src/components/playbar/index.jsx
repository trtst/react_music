import React, { createContext, memo, useRef, useState } from 'react';
import Audio from './audio';
import StripBar from './stripbar';
import sty from './scss/index.module.scss';

const PLAYBAR = createContext();

export default memo(function PlayBar() {
    const [ curTime, setCurTime ] = useState(0);  // 当前播放歌曲时长
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
});
