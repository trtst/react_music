import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { loginStore, playListInfoStore } from '@store/index';
import { playListDetail, songDetail, playlistRelated, playlistComment } from '@apis/http';
import { formatSongs, formartDate, formartNum, formatMsgTime } from '@utils/index';
import SongList from '@components/songlist';
import sty from './scss/detail.module.scss';

export default function PlayListDetail() {
    const [ isLogin, setLoginModle ] = loginStore((state) => [
        state.isLogin,
        state.setLoginModle
    ]); 
    const playAllSong = playListInfoStore((state) => state.playAllSong);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const location = useLocation();
    const id = searchParams.get('id') ?? '';
    const [ info, setInfo ] = useState({});          // 歌单详情数据
    const [ songList, setSongList ] = useState([]);  // 歌单歌曲列表
    const [ playlist, setPlaylist ] = useState([]);  // 相关歌单推荐
    const [ comments, setComments ] = useState([]);  // 歌单精彩评论
    const [ loading, setLoading ] = useState(true);
    const [ total, setTotal ] = useState(0);

    // 获取歌单详情
    const getDetail =  async(params) => {
        setLoading(true);
        const { data: res } = await playListDetail(params)
    
        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setInfo(res.playlist);
    
        if (isLogin) {
            getAllSongs(res.playlist.trackIds);
        } else {
            const lists = formatSongs(res.playlist.tracks, res.privileges);

            setSongList(lists);
            setTotal(lists.length);
            setLoading(false);
        }
    };

    // 登录后根据ids获取所有歌曲列表
    const getAllSongs = async(ids) => {
        const sliceArr = []
        const num = 500
        let idsArr = []

        // 数组过长 每500份一组
        for (let index = 0; index < ids.length; index += num) {
            sliceArr.push(ids.slice(index, index + num))
        }

        for (let i = 0; i < sliceArr.length; i++) {
            const arrs = []
            sliceArr[i].map(d => {
                arrs.push(d.id)
            });

            const { data: res } = await songDetail({ ids: arrs.join(','), timestamp: new Date().valueOf() + i })

            idsArr = idsArr.concat(formatSongs(res.songs, res.privileges))
        }

        setSongList(idsArr);
        setTotal(idsArr.length);
        setLoading(false);
    };

    // 相关歌单推荐
    const getRecom = async(params) => {
        const { data: res } = await playlistRelated(params)

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setPlaylist(res.playlists);
    };

    // 歌单精彩评论
    const getComment = async(params) => {
        const { data: res } = await playlistComment(params)

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setComments(res.comments);
    };

    // 播放列表为当前歌单的全部歌曲
    const playAllSongs = () => {
        playAllSong(songList);
    };

    // 显示登录弹窗
    const loginHanlder = () => {
        setLoginModle(true);
    };

    const _initialize = (id) => {
        // 歌单详情
        getDetail({ id, s: 8 });
        // 相关歌单推荐
        getRecom({ id });
        // 歌单评论
        getComment({ id, limit: 8 });
    };

    useEffect(() => {
        _initialize(id);
    }, [location]);

    useEffect(() => {
        getDetail({ id, s: 8 });
    }, [isLogin]);

    return (
        <div className={sty.detail}>
            <div className={sty.detail_layout}>
                <div className={sty.detail_main}>
                    <div className={sty.cover}>
                        <div className={sty.cover_img}>
                            <img src={info.coverImgUrl} alt="" />
                        </div>
                        <div className={sty.cover_desc}>
                            {
                                info.trackNumberUpdateTime && 
                                (
                                    <>
                                        <h4>更新时间<em>{info.updateFrequency}</em></h4>
                                        <p>{formartDate(info.trackNumberUpdateTime, 'yyyy-MM-dd HH:mm:ss')}</p>
                                    </>
                                )
                            }
                            {
                                info.subscribers && (
                                    <>
                                        <h4>喜欢这个歌单的人</h4>
                                        <div className={sty.sub_playlist}>
                                            {
                                                info.subscribers.map(author => 
                                                    <Link to={`/user?id=${author.userId}`} key={author.userId} className={sty.author_home}>
                                                        <img src={author.avatarUrl} />
                                                    </Link>
                                                )
                                            }
                                        </div>
                                    </>
                                )
                            }
                            {
                                info.description && 
                                (
                                    <>
                                        <h4>介绍</h4>
                                        <pre className={sty.cover_desc_all}>
                                            {info.description}
                                        </pre>
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div className={sty.detail_info}>
                        <div className={sty.cover_info}>
                            <div className={sty.cover_header}>
                                {info.name}
                            </div>
                            <div className={sty.cover_author}>
                                {
                                    info.creator && (
                                        <>
                                            <Link to={`/user?id=${info.creator.userId}`} className={sty.author_home}>
                                                <img src={info.creator.avatarUrl} className={sty.cover_avatar} />
                                            </Link>
                                            <div className={sty.cover_name}>
                                                <Link to={`/user?id=${info.creator.userId}`} className={sty.author_home}>{info.creator.nickname}</Link>
                                                {
                                                    info.creator.avatarDetail && <img src={info.creator.avatarDetail?.identityIconUrl} className={sty.cover_avatarIcon} />
                                                }
                                            </div>
                                            <div className={sty.cover_date}>{formartDate(info.createTime, 'yyyy-MM-dd')} 创建</div>
                                        </>
                                    )
                                }
                            </div>
                            <div className={sty.cover_digital}>
                                <span className={sty.cover_playCount}> <i className="iconfont icon-playnum"></i> {formartNum(info.playCount)}次播放</span>
                                <span className={sty.cover_collect}> <i className="iconfont icon-collect"></i> {formartNum(info.subscribedCount)}次收藏</span>
                                <span className={sty.cover_comment}> <i className="iconfont icon-comment"></i> {formartNum(info.commentCount)}条留言</span>
                            </div>
                            <div className={sty.cover_tags}>
                                {
                                    info.tags && info.tags.length > 0 &&  
                                    (
                                        <>
                                            <span>Tags:</span>
                                            {
                                                info.tags.map(tag => 
                                                    <Link className={sty.tag} to={`/playlist?cat=${tag}`} key={tag}>
                                                        #{tag}
                                                    </Link>
                                                )
                                            }
                                        </>
                                    )

                                }  
                            </div>
                        </div>
                        <div className={sty.song_main}>
                            <div className={sty.song_header}>
                                <h4>歌曲列表 <em>共 {total + ' 首歌'}</em></h4>
                                <span className={sty.play_all} onClick={playAllSongs}><i className="iconfont icon-audio-play"></i> 播放全部</span>
                                <span className={`collect ${info.subscribed ? 'active' : ''} `}><i className={`iconfont icon-collect${info.subscribed ? '-active' : ''}`}></i> { info.subscribed ? '已收藏' : '收藏' }</span>
                            </div>
                            <SongList lists={songList} loading={loading} />
                            {
                                !isLogin && (
                                    <div className={sty.showAllSongsTips}>
                                        <span onClick={loginHanlder}>登录后查看全部歌曲</span>
                                    </div>
                                )
                            }
                            
                        </div>
                    </div>
                </div>
                <div className={sty.detail_aside}>
                    {
                        (playlist.length > 0) && (
                            <>
                                <div className={sty.aside_title}>相关歌单推荐</div>
                                <div className={`${sty.aside_main} ${sty.recom_main}`}>
                                    {
                                        playlist.map(item => 
                                            <div className={sty.recom_item} key={item.id}>
                                                <Link to={`/playlist/detail?id=${item.id}`}><img className={sty.recom_img} src={item.coverImgUrl} /></Link>
                                                
                                                <div className={sty.recom_info}>
                                                    <Link to={`/playlist/detail?id=${item.id}`} className={sty.recom_name}>{item.name}</Link>
                                                    <div className={sty.recom_author}>
                                                        By. <Link to={`/user?id=${item.creator.userId}`}>{ item.creator.nickname }</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </>
                        )
                    }
                    {
                        (comments.length > 0) && (
                            <>
                                <div className={sty.aside_title}>歌单评论</div>
                                <div className={`${sty.aside_main} ${sty.comment_main}`}>
                                    {
                                        comments.map(item => 
                                            <div className={sty.comment_item} key={item.commentId}>
                                                <Link to={`/user?id=${item.commentId}`}>
                                                    <img className={sty.comment_img} src={item.user.avatarUrl} />
                                                </Link>
                                                <div className={sty.comment_info}>
                                                    <div className={sty.comment_userInfo}>
                                                        <Link to={`/user?id=${item.commentId}`} className={sty.comment_name}>
                                                            {item.user.nickname}
                                                        </Link>
                                                        <span className={sty.comment_date}>{formatMsgTime(item.time)}</span>
                                                    </div>
                                                    <div className={sty.comment_desc}>{item.content}</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
