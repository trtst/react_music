import React, { forwardRef, memo, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { playListInfoStore, playerSetStore } from '@store/index';

export default memo(forwardRef(function Audio({ ctx }, ref) {
    const myAudio = useRef();
    const { setCurTime } = useContext(ctx);

    const [ initAudioReady, setInitAudioReady ] = useState(false);  // 初始化音频准备
    
    // 是否正在播放 & 获取当前播放音乐信息
    const [ isPlayed, setPlayed, playListStore, playIndexStore, setPlayIndex, curSongInfo ] = playListInfoStore((state) => [ 
        state.isPlayed, 
        state.setPlayed,
        state.playList,
        state.playIndex,
        state.setPlayIndex,
        state.playList[state.playIndex],
    ]);
    
    // 音量值(0~1) && 播放模式
    const [ volume, mode ] = playerSetStore( state => [ state.volume, state.mode]);

    // 音频初始化后准备就绪
    const canplaySong = (e) => {
        setInitAudioReady(true);
    };

    // 音频播放时候 初始化状态，获取音频总时长
    const playSong = (e) => {
        // setInitAudioReady(true);
        // setPlayed(true);
    };

    // 音乐 播放/暂停/上一首/下一首
    const playAudioType = (type) => {
        if (type === 'play') {
            setPlayed(!isPlayed);
        } else {
            changeSong(type);
        }
    };

    // 手动切换歌曲
    const changeSong = (type) => { // type: prev/next  上一首/下一首
        if (playListStore.length !== 1) { // 若播放列表只有一首歌则单曲循环
            let index = playIndexStore;

            if (mode === 2) { // 随机模式
                index = Math.floor(Math.random() * playListStore.length - 1) + 1
            } else {
                if (type === 'prev') { // 上一首
                    index = index === 0 ? playListStore.length - 1 : --index
                } else {  // 下一首
                    index = index >= playListStore.length - 1 ? 0 : ++index
                }
            }

            setInitAudioReady(false);
            setPlayed(true);
            setPlayIndex(index);
        } else {
            loopSong()
        }
    };

    // 单曲循环歌曲
    const loopSong = () => {
        const $myAudio = myAudio.current;

        $myAudio.currentTime = 0;
        $myAudio.play();
        setPlayed(true);
    };

    // 音频播放结束 自动播放下一首
    const endedSong = () => {
        if (mode === 1) {
            loopSong()
        } else {
            changeSong('next')
        }
    };

    // 设置音频音量大小
    const setVolumeHandler = (val) => {
        const $myAudio = myAudio.current;
        $myAudio.volume = val;
        $myAudio.muted = val ? 0 : 1;
    }

    // 点击拖拽进度条，设置当前时间
    const setAudioProgress = (t) => {
        const $myAudio = myAudio.current;
        $myAudio.currentTime = t;
    }

    // 监听音频时间， 实时更新当前播放时间
    const updateSongTime = (e) => {
        if (initAudioReady) {
            setCurTime(e.target.currentTime);
        }
    };

    useEffect(() => {
        setInitAudioReady(false);
        setCurTime(0);

        // 当前播放歌曲变化的时候  重置状态及当前播放的时长
        // 页面初始化后，给音频设置音量
        const $myAudio = myAudio.current;
    
        if ($myAudio) {
            // $myAudio.play();
            $myAudio.volume = volume;
        }
    }, [curSongInfo]);

    useEffect(() => {
        // 等待音频加载成功完成后播放
        if (initAudioReady) {
            const $myAudio = myAudio.current;

            if ($myAudio) {
                isPlayed ? $myAudio.play() : $myAudio.pause();
            }
        };
    }, [initAudioReady, isPlayed]);

    // 暴露出音频组件的方法,在其他组件调用
    useImperativeHandle(ref, () => {
        return {
            playAudioType,
            setVolumeHandler,
            setAudioProgress,
        }
    });

    return (
        <>
            {
                // 当前歌曲播放信息存在且初始化完成则渲染播放器，否则会重复渲染
                curSongInfo && (
                    <audio 
                        ref={myAudio}
                        preload="auto"
                        onCanPlay={canplaySong}
                        onPlaying={playSong}
                        onEnded={endedSong}
                        onTimeUpdate={updateSongTime}
                        src={curSongInfo.url}
                    />
                )
            }
        </>
    )
}))
