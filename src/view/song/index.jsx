import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Lyric from '@components/lyric';
import Comments from '@components/comments';
import { formatSongs, formatSongInfo, formatSongTime, formatMsgTime } from '@utils/index';
import { songDetail, simiSong, simiPlayList, mlog } from '@apis/http';
import { playListInfoStore } from '@store/index';
import sty from './index.module.scss';

const commentType = 0; // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态

export default function SongDetail() {
    const [ searchParams ] = useSearchParams();
    const id = searchParams.get('id') ?? '';
    const [ info, setInfo ] = useState();
    const [ simiList, setSimiList ] = useState([]);   // 相似歌曲
    const [ playlists, setPlaylists ] = useState([]);   // 相似歌曲
    const [ mlogs, setMlogs ] = useState([]);   // 相似歌曲
    const [ coverDesc, setcoverDesc ] = useState('');

    const [ isPlayed, curSongInfo, addToList, setPlayed, selectPlay ] = playListInfoStore( state => [ 
        state.isPlayed, 
        state.playList[state.playIndex],
        state.addToList,
        state.setPlayed,
        state.selectPlay
    ]);

    // 当前播放歌曲icon状态
    const playIcon = useMemo(() => {
        return item => `iconfont ${ isPlayed && (item.id === curSongInfo.id) ? 'icon-pause' : 'icon-play'}`;
    });

    // 获取歌曲详情
    const getSongDetail = async () => {
        const { data: res } = await songDetail({ ids: id, timestamp: new Date().valueOf() })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        // 是否有版权播放
        res.songs[0].license = !res.privileges[0].cp;
        const songInfo = formatSongs(res.songs, res.privileges)[0];
        setInfo(songInfo);
        // 显示歌曲简介
        setcoverDesc(songInfo.alia.join(' / '))
    };

    // 获取相似音乐
    const getSimiSong = async() => {
        const { data: res } = await simiSong({ id })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        const list = res.songs.map(item => formatSongInfo(item));

        setSimiList(list);
    };


    // 包含这首歌的歌单
    const getSimiPlayList = async() => {
        const { data: res } = await simiPlayList({ id })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setPlaylists(res.playlists);
    };

    // 获取可以调用此接口获取歌曲相关视频 (区别于 MV)， 有些歌曲没有 MV 但是有用户上传的与此歌曲相关的 Mlog
    const getMlog = async() => {
        const { data: res } = await mlog({ id })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setMlogs(res.data.feeds);
    };

    // 播放音乐
    const playCurrentSong = (item) => {
        return () => {
            // 若当前唔歌曲 或者 当前播放歌曲不是本歌单显示的歌曲  立即播放当前歌单
            if (!curSongInfo || curSongInfo.id != item.id) {
                // 无版权及vip不可播放
                if (item.license) {
                    proxy.$msg.error('由于版权保护，您所在的地区暂时无法使用。')
                    return
                }

                if (item.vip) {
                    proxy.$msg.error('付费歌曲，请在网易云音乐播放')
                    return
                }
                selectPlay([item]);
            } else {
                setPlayed(!isPlayed);
            }
        }
    };

    // 添加到播放列表
    const addPlayList = item => {
        return () => {
            addToList([item]);
        }
    };

    const jumpComment = () => {

    }

    useEffect(() => {
        getSongDetail();
        getSimiSong();
        getSimiPlayList();
        getMlog();
    }, [id]);

    return (
        <div className={sty.song}>
            <div className={sty.song_main}>
                {
                    info && (
                        <div className={sty.song_l}>
                            <div className={sty.cover}>
                                <div className={sty.cover_img}>
                                    <img src={info.album.picUrl} alt="" />
                                </div>
                                <div className={sty.cover_play_img}>
                                    {/* <img src={info.album.picUrl} alt="" /> */}
                                </div>
                            </div>
                            <div className={sty.song_oper}>
                                <span className={`${sty.play_btn} ${sty.play_all}`} onClick={playCurrentSong(info)}><i className={playIcon(info)}></i> {info.vip ? 'VIP尊享' : '播放'}</span>
                                <span className={`${sty.play_btn} ${sty.play_add}`} onClick={addPlayList(info)}><i className="iconfont icon-add"></i> 添加</span>
                                <span className={`${sty.play_btn} ${sty.play_collect}`}><i className="iconfont icon-collect"></i> 收藏</span>
                                <span className={`${sty.play_btn} ${sty.play_comment}`} onClick={jumpComment}><i className="iconfont icon-comment"></i> 评论</span>
                            </div>
                            <div className={sty.simi_song}>
                                <h3 className={sty.song_title}>相似歌曲</h3>
                                <div className={sty.aside_main}>
                                    {
                                        simiList.length > 0 && simiList.map(item => (
                                            <div className={sty.simi_item} key={item.id}>
                                                <div className={sty.item_info}>
                                                    <Link className={sty.item_name} to={`/song?id${item.id}`}>{ item.name } </Link>
                                                    <div className={sty.item_author}>
                                                        {
                                                            item.singer && item.singer.map((author, k) => (
                                                                <Link to={`/singer/detail?id=${author.id}`} className={sty.song_author} key={author.name}>{ k !== 0 ? ' / ' + author.name : author.name }</Link>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                                <div className={sty.song_status}>
                                                    {
                                                        item.vip ?
                                                        (<i className="iconfont icon-vip"></i>) :
                                                        <>
                                                            <i onClick={playCurrentSong(item)} className={playIcon(item)}></i>
                                                            <i onClick={addPlayList(item)} className="iconfont icon-add" title="添加到列表"></i>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    info && (
                        <div className={sty.song_m}>
                            <div className={sty.song_info}>
                                <div className={sty.song_info_head}>
                                    <div className={sty.song_title}>{info.name}</div>
                                    {
                                        info.mvId && (
                                            <Link to={`/mv?id=${info.mvId}`} >
                                                <i className="iconfont icon-mvlist"></i>
                                            </Link>
                                        )
                                    }
                                    {
                                        info.vip && (
                                        <i className="iconfont icon-vip"></i>
                                        )
                                    }
                                </div>
                                {
                                    info.coverDesc && (
                                        <div className={sty.song_desc}>
                                            {info.coverDesc}
                                        </div>
                                    )
                                }
                                <div className={sty.song_related}>
                                    <div className={sty.song_author}>
                                        歌手： {
                                            info.singer && info.singer.map((author, k) => (
                                                <Link className={sty.song_author} to={`/singner/detail?id=${author.id}`} key={author.name}>
                                                    { k !== 0 ? ' / ' + author.name : author.name }
                                                </Link>
                                            ))
                                        }
                                    </div>
                                    <div className={sty.song_album}>
                                        所属专辑：<Link className={sty.song_album} to={`/album?id=${info.album.id}`}>{ info.album.name }</Link>
                                    </div>
                                </div>
                            </div>
                            <div className={sty.lyric}>
                                <Lyric sId={id} maxH={'auto'} />
                            </div>
                            <div className={sty.comments}>
                                <Comments type={commentType} id={id} />
                            </div>
                        </div>
                    )
                }
            </div>
            <div className={sty.song_aside}>
                {
                    playlists.length > 0 && (
                        <div className={`${sty.sidebar_box} ${sty.playlist_simi}`}>
                            <h3 className={sty.aside_title}>包含这首歌的歌单</h3>
                            <div className={sty.aside_main}>
                                {
                                    playlists.map(item => (
                                        <div className={sty.playlist_item} key={item.id}>
                                            <Link to={`/playlist/detail?id=${item.id}`} className={sty.playlist_cover}>
                                                <img src={item.coverImgUrl} />
                                            </Link>
                                            <div className={sty.playlist_info}>
                                                <Link to={`/playlist/detail?id=${item.id}`} className={sty.playlist_name}>
                                                    {item.name}
                                                </Link>
                                                <div className={sty.playlist_author}>
                                                    By. <Link to={`/user?id=${item.creator.userId}`}>{ item.creator.nickname }</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }

                {
                    mlogs.length > 0 && (
                        <div className={`${sty.sidebar_box} ${sty.simi_mlog}`}>
                            <h3 className={sty.aside_title}>相关视频</h3>
                            <div className={sty.aside_main}>
                                {
                                    mlogs.map(mlog => (
                                        <Link to={`/mv?id=${mlog.id}`} key={mlog.id} className={sty.mlog_item}>
                                            <div className={sty.mlog_img}>
                                                <i className="iconfont icon-mvlist"></i>
                                                <img src={mlog.resource.mlogBaseData.coverUrl} className={sty.mlog_cover} />
                                            </div>
                                            <div className={sty.mlog_time}><i className="iconfont icon-time"></i> {formatSongTime(mlog.resource.mlogBaseData.duration)}</div>
                                            <div className={sty.mlog_name}>{ mlog.resource.mlogBaseData.text }</div>
                                            <div className={sty.mlog_footer}>
                                                <span className={sty.mlog_author}>{ mlog.resource.userProfile.nickname }</span>
                                                <span className={sty.mlog_pubTime}>{ formatMsgTime(mlog.resource.mlogBaseData.pubTime) }</span>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
