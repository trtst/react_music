import React, { forwardRef, useContext, useMemo, useState } from 'react';
import { Slider, Popover } from 'antd';
import SongList from '@components/songlist';
import Lyric from '@components/lyric';
import { playListInfoStore, playerSetStore } from '@store/index';
import { formatSongTime } from '@utils/index';
import sty from './scss/index.module.scss';
import { Link } from 'react-router-dom';

export default forwardRef(function stripbar({ ctx }, ref) {
    const { curTime, setCurTime } = useContext(ctx);
    const audioProgressWidth = useMemo(() => curTime);

    // 获取当前播放音乐信息
    const [ isPlayed, playListStore, curSongInfo, setPlayIndex, setPlayList, setPlayed ] = playListInfoStore(state => [
        state.isPlayed,
        state.playList,
        state.playList[state.playIndex],
        state.setPlayIndex,
        state.setPlayList,
        state.setPlayed
    ]);


    const [ muted, setMuted ] = useState(false);  // 是否静音
    const [ oldVol, setOldVol ] = useState(0);    // 取消禁音的时候，设置保留的上一次的音量值
    const setPlayerSetting = playerSetStore((state) => state.setPlayerSetting);
    // 音量值(0~1) && 播放模式
    const [ volume, mode ] = playerSetStore( state => [ state.volume, state.mode]);
    const volumeProgressWidth = useMemo(() => volume );

    // 播放暂停按钮
    const playIcon = useMemo(() => !isPlayed ? 'icon-audio-play' : 'icon-audio-pause');
    // 是否静音图标
    const mutedIcon = useMemo(() => muted || volume == 0 ? 'icon-volume-active' : 'icon-volume');

    // 拖拽滑动条，更改音频进度
    // TODO: 
    // 优化: 拖拽的时候，音频会比较杂，想要的效果，拖拽的时候，只有滑动条进度改变，但音频继续播放
    // vue版本已实现，react待优化
    const setAudioProgress = (val) => {
        setCurTime(val);
        ref.current.setAudioProgress(val);
    };

    // 音频播放/暂停/上一首/下一首事件
    const audioHandler = (type) => {
        return () => {
            ref.current.playAudioType(type);
        }
    };

    // 音量禁音及取消操作
    const volumeHandler = () => {
        const isMuted = !muted;

        setMuted(isMuted);
        isMuted && (setOldVol(volume));

        // 实时改变音量大小
        ref.current.setVolumeHandler(isMuted ? 0 : oldVol);
        
        // 个性化，本地保存用户设置的音量
        setPlayerSetting('volume', isMuted ? 0 : oldVol);
    };

    // 点击拖拽音量条，设置当前音量
    const setVolumeProgress = (val) => {

        setMuted(val ? 0 : 1);
        setOldVol(val);
        
        // 实时改变音量大小
        ref.current.setVolumeHandler(val);
        
        // 个性化，本地保存用户设置的音量
        setPlayerSetting('volume', val);
    };

    // 播放模式
    const modeIcon = useMemo(() => {
        const params = [{
            className: 'icon-loop',
            title: '循环模式'
        }, {
            className: 'icon-single-cycle',
            title: '单曲循环'
        }, {
            className: 'icon-shuffle',
            title: '随机播放'
        }]
        return params[mode]
    });

    // 切换播放模式
    const changePlayMode = () => {
        const newMode = mode >= 2 ? 0 : mode + 1;

        setPlayerSetting('mode', newMode);
    };

    const [ isShowLyric, setisShowLyric ] = useState(false);
    const lyricsHanlder = () => {
        setisShowLyric(!isShowLyric);
    };

    // 清空播放列表
    const clearSonglist = () => {
        setPlayIndex(0);
        setPlayList([]);
        setPlayed(false);
    };

    const [isShowLists, setisShowLists ] = useState(false);
    const playlistHanlder = () => {
        setisShowLists(!isShowLists);
    };

    return (
        <>
            {
                curSongInfo && (
                    <div className={sty.paly_bar}>
                        <Slider 
                            min={0}
                            max={curSongInfo.milliseconds}
                            step={0.01}
                            value={audioProgressWidth} 
                            onChange={setAudioProgress} 
                            className={sty.audio_progress} 
                            tooltip={{ formatter: null }} />
                        <div className={sty.play_bar_main}>
                            <div className={sty.bar_l}>
                                <Link to={`/song?id=${curSongInfo.id}`}>
                                    <img src={curSongInfo.album.picUrl} className={sty.bar_cover_img} />
                                </Link>
                                <div className={sty.bar_name}>
                                    <Link to={`/song?id=${curSongInfo.id}`} className={sty.song_name}>
                                        {curSongInfo.name}
                                    </Link>
                                    <p>
                                        {
                                            curSongInfo.singer.map((author, k) => (
                                                <Link to={`/singer/detail?id=${author.id}`} className={sty.song_author} key={author.name}>{ k !== 0 ? ' / ' + author.name : author.name }</Link>
                                            ))
                                        }
                                    </p>
                                </div>
                                <div className={sty.bar_time}>
                                    <span>{ formatSongTime(curTime * 1000)}</span> / {curSongInfo.duration}
                                </div>
                            </div>
                            <div className={sty.bar_m}>
                                <div className={sty.bar_control}>
                                    <i className="iconfont icon-audio-prev" title="上一首" onClick={audioHandler('prev')}></i>
                                    <i className={`iconfont ${playIcon}`} onClick={audioHandler('play')}></i>
                                    <i className="iconfont icon-audio-next" title="下一首" onClick={audioHandler('next')}></i>
                                </div>
                            </div>
                            <div className={sty.bar_r}>
                                <div className={sty.bar_oper}>
                                    <div className={sty.volume_main}>
                                        <i className={`iconfont ${mutedIcon}`} title="音量" onClick={volumeHandler}></i>
                                        <Slider min={0} max={1} step={0.01} className={sty.volume_line} value={volumeProgressWidth} onChange={setVolumeProgress} tooltip={{ formatter: null }} />
                                    </div>
                                    <i className={`iconfont ${modeIcon.className}`} title={modeIcon.title} onClick={changePlayMode}></i>
                                    
                                    <Popover
                                        content={
                                            <div className={sty.lyric_main}>
                                                <h3 className={sty.lyric_header}>歌词</h3>
                                                <Lyric sId={curSongInfo.id} currentTime={curTime} />
                                            </div>
                                        }
                                        trigger="click"
                                        open={isShowLyric}
                                        onOpenChange={lyricsHanlder}
                                    >
                                        <div className={sty.lyric}>
                                            <span className={sty.lyric_btn} title="歌词">词</span>
                                        </div>
                                    </Popover>
                                    
                                    <Popover
                                        content={
                                            <div className={sty.pop_main}>
                                                <h3 className={sty.pop_header}>
                                                    <span>播放列表<em>(共{playListStore.length}首)</em></span>
                                                    <div className={sty.del_songlist} onClick={clearSonglist}><i className="iconfont icon-del" title="清空列表"></i>清空列表</div>
                                                </h3>
                                                <SongList lists={playListStore} typeSize={'mini'} isScroll={true} loading={false} />
                                            </div>
                                        }
                                        trigger="click"
                                        placement="topRight"
                                        open={isShowLists}
                                        onOpenChange={playlistHanlder}
                                    >
                                        <div className={sty.playlist_main}>
                                            <i className="iconfont icon-gedan"></i>
                                            <div className={sty.playlist_num}>{ 99 > playListStore.length ? playListStore.length : '99+'}</div>
                                        </div>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
});