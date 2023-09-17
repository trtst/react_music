import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { playListInfoStore } from '@store/index';
import { lyrics } from '@apis/http';
import { App } from 'antd';
import sty from './scss/index.module.scss';

// 找到当前对应的歌词
const findCurIndex = (lyric, t) => {
    for (let i = 0; i < lyric.length; i++) {
        if (t <= lyric[i].t) {
            return i
        }
    }
    return lyric.length
};

// 歌词处理
const formartLyric = (lrc, set) => {
    // 纯音乐，无歌词
    if (!lrc.lyric) {
        set([]);
        return
    }

    const lrcReg = /^\[(\d{2}):(\d{2}.\d{2,})\]\s*(.+)$/;
    const lyricArr = lrc.lyric.split('\n');
    let  lyricList = [];

    lyricArr.forEach(item => {
        const arr = lrcReg.exec(item)

        if (!arr) {
            return
        }

        lyricList.push({ t: arr[1] * 60 * 1 + arr[2] * 1, txt: arr[3] })
    })

    // 根据时间轴重排顺序
    lyricList.sort((a, b) => {
        return a.t - b.t
    });

    set(lyricList);
};

export default memo(function Lyric({ sId, currentTime = 0, maxH = '390px'}) {
    const { message } = App.useApp();
    // 获取当前播放音乐信息
    const curSongInfo = playListInfoStore(state => state.playList[state.playIndex]);
    const [ lyric, setLyric ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    // 获取当前歌曲ID的歌词
    const  getLyrics = async (id) => {
        setLoading(true);
        const { data: res } = await lyrics({ id })
    
        if (res.code !== 200) {
            return message.error({
                content: res.message
            });
        }
        
        formartLyric(res.lrc, setLyric);
        setLoading(false);
    };

    const [ curIndex, setcurIndex ] = useState(0);
    const isCurLyric = useMemo(() => {
        return (index) => {
            return index === curIndex && currentTime && curSongInfo.id == sId ? 'active' : '';
        }
    }, [curIndex, currentTime, curSongInfo, sId]);

    // TODO:
    // 歌词自动滚动与滚轮滚动冲突，需要做兼容
    // 歌词实时滚动
    const lyricsRef = useRef();
    const transformLyric = useMemo(() => {
        if (curSongInfo && curSongInfo.id == sId) {
            let num = 0, max = 13;
            if (curIndex < Math.ceil(max / 2) || lyric.length <= max) {
                num = 0;
            } else if (curIndex >= lyric.length - max && (curIndex >= lyric.length - Math.ceil(max / 2)) && lyric.length > max) {
                num = (lyric.length - max) * 30;
            } else {
                num = (curIndex - Math.floor(max / 2)) * 30;
            }

            lyricsRef.current && lyricsRef.current.scrollTo({
                top: num,
                behavior: "smooth",
            });
            // return { top: `${num}px` };
        }
    }, [curSongInfo, curIndex, lyric]);

    useEffect(() => {
        setLyric([]);
        setcurIndex(0);
        getLyrics(sId);
    }, [sId])

    useEffect(() => {
        // 无歌词的时候 不做动画滚动
        if (lyric.length) {
            setcurIndex(findCurIndex(lyric, currentTime) - 1);
        }
    }, [currentTime])

    return (
        <div className={sty.lyrics_main} ref={lyricsRef} style={{maxHeight: maxH}}>
            {
                loading ? 
                <div className={sty.lyric_empty}>
                    <p>歌词加载中......</p>
                </div>
                : (
                    lyric.length > 0 ?
                    <div className={sty.lyrics} style={transformLyric}>
                        {
                            lyric.map((item, index) => 
                                <p className={isCurLyric(index)} key={item.t}>{item.txt}</p>
                            )
                        }
                    </div> :
                    <div className={sty.lyric_empty}>
                        <p>纯音乐，无歌词</p>
                    </div>
                )
            }
        </div>
    )
})