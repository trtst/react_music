import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import SongList from '@components/songlist';
import AlbumList from '@components/album/list';
import MvList from '@components/mv/list';
import { artistDetail, artists, artistFans, artistFansCount, simiArtists, artistSub, artistAlbum, artistMv, artistDesc } from '@apis/http';
import { playListInfoStore } from '@store/index';
import { formartNum, formatSongInfo } from '@utils/index';
import sty from './scss/detail.module.scss';

export default function SingerDetail() {
    const location = useLocation();
    const [ searchParams ] = useSearchParams();
    const id = searchParams.get('id') ?? '';
    const [ artist, setArtist ] = useState({});   // 获取歌手详情
    const [ fans, setFans ] = useState([]);       // 获取粉丝列表
    const [ fansCount, setFansCount ] = useState({});       // 获取粉丝列表
    const [ simiList, setSimiList ] = useState([]);       // 获取相似歌手
    const [ hotSongs, setHotSongs ] = useState([]);       // 热门作品
    const [ hotAlbums, setHotAlbums ] = useState([]);       // 热门作品
    const [ hotMvs, setHotMvs ] = useState([]);       // 热门作品
    const [ briefDesc, setBriefDesc ] = useState();       // 热门作品
    const [ introduction, setIntroduction ] = useState([]);       // 热门作品
    
    const [ type, setType ] = useState('hot');
    const [ playAllSong, addToList ] = playListInfoStore( state => [ state.playAllSong, state.addToList ]);
    const [ loading, setLoading ] = useState(true);
    const [ listLoad, setListLoad ] = useState(true);
    const [ params, setParams ] = useState({
        id,
        limit: 24,
        offset: 0
    });

    // 歌手详情
    const getArtistsDetail = async() => {
        setLoading(true);
        const { data: res } = await artistDetail({ id, timestamp: new Date().valueOf() })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setArtist({...res.data.artist, ...res.data.user});
        setLoading(false);
    };

    // 歌手热门作品
    const getArtists = async() => {
        setListLoad(true);
        const { data: res } = await artists({ id, timestamp: new Date().valueOf() })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        const list = res.hotSongs.map(item => formatSongInfo(item));
        setHotSongs(list);
        setListLoad(false);
    };

    // 歌手专辑
    const getArtistAlbum = async(par) => {
        setListLoad(true);
        const { data: res } = await artistAlbum(par)

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setHotAlbums(res.hotAlbums);
        setListLoad(false);
    };

    // 歌手MV
    const getArtistMv = async(par) => {
        setListLoad(true);
        const { data: res } = await artistMv(par)
    
        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }
    
        setHotMvs(res.mvs);
        setListLoad(false);
    };

    // 歌手简介
    const getArtistDesc = async () => {
        setListLoad(true);
        const { data: res } = await artistDesc({ id })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setBriefDesc(res.briefDesc);
        setIntroduction(res.introduction);
        setListLoad(false);
    };

    const playAllList = () => {
        playAllSong(hotSongs);
    };
    const addAll = () => {
        addToList(hotSongs);
    };
    const collectAll = () => {
    };

    // 切换类别
    // TODO:  小优化，切换的时候不用重新请求数据
    const changeType = (type) => {
        return () => {
            setType(type);
        }
    }

    // 获取歌手粉丝
    const getArtistFans = async() => {
        const { data: res } = await artistFans({ id })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }
        
        setFans(res.data);
    };

    // 获取歌手粉丝数量
    const getArtistFansCount = async() => {
        const { data: res } = await artistFansCount({ id })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }
        
        setFansCount(res.data);
    };

    // 关注、取消歌手
    const followArtist = (item, type) => {
        return async() => {
            console.log(item);
            const { data: res } = await artistSub({ id: item.id, t: item.followed ? 0 : 1 })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            if (type == 'list') {
                const newList = [...simiList];
                const curItem = newList.find(item => item.id == item.id);
    
                curItem.followed = Number(!item.followed);
                
                setSimiList(newList);
            }

            if (type == 'user') {
                const newArtist = Object.assign({}, artist);

                newArtist.followed = Number(!item.followed);
                setArtist(newArtist);
            }
        }
    }

    // 相似歌手
    const getSimiArtists = async() => {
        const { data: res } = await simiArtists({ id })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }
        
        setSimiList(res.artists.slice(0, 8));
    };

    useEffect(() => {
        getArtistsDetail();
        getArtistFans();
        getArtistFansCount();
        getSimiArtists();
    }, [location]);

    useEffect(() => {
        if (type == 'hot' && !hotSongs.length) {
            getArtists();
        }

        if (type == 'album' && !hotAlbums.length) {
            getArtistAlbum(params);
        }

        if (type == 'mv' && !hotMvs.length) {
            getArtistMv(params);
        }

        if (type == 'brief' && !briefDesc) {
            getArtistDesc();
        }
        
    }, [type]);

    return (
        <div className={sty.detail}>
            <div className={sty.detail_main}>
                <div className={sty.detail_headImg}>
                    <img src={artist.cover} alt="" />
                </div>
                <div className={sty.detail_info}>
                    <div className={sty.cover}>
                        <div className={sty.cover_img}>
                            <img src={`${artist.avatar}?param=250y250`} />
                        </div>
                    </div>
                    <div className={sty.singer_info}>
                        <div className={sty.singer_name}>{artist.name}</div>
                        <div className={sty.singer_alias}>
                            {
                                artist.alias && artist.alias.map(item => 
                                    <span key={item}>{item}</span>
                                )
                            }
                        </div>
                        <div className={sty.singer_digital}>
                            <span className={sty.singer_count}><em>单曲</em>{formartNum(artist.musicSize)}</span>
                            <span className={sty.singer_count}><em>专辑</em>{formartNum(artist.albumSize)}</span>
                            <span className={sty.singer_count}><em>MV</em>{formartNum(artist.mvSize)}</span>
                        </div>
                    </div>
                    <div className={sty.followed}>
                        <span className={artist.followed ? 'active' : ''} onClick={followArtist(artist, 'user')}>
                            <i className={`iconfont icon-collect${artist.followed ? '-active' : ''}`}></i>
                            { artist.followed ? '已关注' : '关注TA'}</span>
                    </div>
                </div>
                <div className={sty.singer_main}>
                    <div className={sty.singer_header}>
                        <em>作品集</em>
                        <div className={sty.singer_tab}>
                            <span className={type === 'hot' ? 'active' : ''} onClick={changeType('hot')}>热门作品</span>
                            <span className={type === 'album' ? 'active' : ''} onClick={changeType('album')}>所有专辑</span>
                            <span className={type === 'mv' ? 'active' : ''} onClick={changeType('mv')}>相关MV</span>
                            <span className={type === 'brief' ? 'active' : ''} onClick={changeType('brief')}>艺人介绍</span>
                        </div>
                        {
                            type == 'hot' && (
                                <div className={sty.song_oper}>
                                    <span onClick={playAllList} className={`${sty.singer_btn} ${sty.playAll}`}><i className="iconfont icon-audio-play"></i> 播放全部</span>
                                    <span onClick={addAll} className={`${sty.singer_btn} ${sty.addAll}`}><i className="iconfont icon-add"></i> 添加到播放列表</span>
                                    <span onClick={collectAll} className={`${sty.singer_btn} ${sty.collectAll}`}><i className="iconfont icon-collect"></i> 收藏热门</span>
                                </div>
                            )
                        }
                    </div>
                    <div className={`${sty.singer_list} ${type}`}>
                        <div className={`${sty.singner_box} hot`}>
                            <SongList lists={hotSongs} loading={listLoad} />
                        </div>
                        <div className={`${sty.singner_box} album`}>
                            <AlbumList lists={hotAlbums} loading={listLoad} count={params.limit} />
                        </div>
                        <div className={`${sty.singner_box} mv`}>
                            <MvList lists={hotMvs} loading={listLoad} count={params.limit} row={4} />
                        </div>
                        <div className={`${sty.singner_box} ${sty.singer_brief} brief`}>
                            <div className={sty.artist_desc_main}>
                                <dl className={sty.introduction}>
                                    <dt>艺人介绍</dt>
                                    <dd>{briefDesc}</dd>
                                </dl>
                                {
                                    introduction.length > 0 && introduction.map((item, index) => (
                                        <dl key={index} className={sty.introduction}>
                                            <dt>{item.ti}</dt>
                                            <dd>{item.txt}</dd>
                                        </dl>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={sty.detail_aside}>
                <div className={`${sty.singer_box} ${sty.singer_fans}`}>
                    <div className={sty.aside_title}>Fans · 粉丝</div>
                    <div className={`${sty.aside_main} ${sty.fans_main}`}>
                        <div className={sty.fans_list}>
                            {
                                fans.length > 0 && fans.map(item => (
                                    <Link className={sty.fans_item} to={{ path: '/user?id=${item.userProfile.userId}'}} key={item.userProfile.userId}>
                                        <img src={`${item.userProfile.avatarUrl}?param=40y40`} />
                                        {/* <div className="fans-name">{item.userProfile.nickname}</div> */}
                                    </Link>
                                ))
                            }
                        </div>

                        <div className={sty.fans_num}>{formartNum(fansCount.fansCnt)}<span>人已关注</span></div>
                        <div className={sty.fans_tips}>点击关注，聆听更多美好音乐</div>
                    </div>
                </div>
                <div className={sty.singer_box}>
                    <div className={sty.aside_title}>相似歌手</div>
                    <div className={sty.aside_main}>
                        {
                            simiList.length > 0 && simiList.map(item => (
                                <div className={sty.simi_item} key={item.id}>
                                    <Link className={sty.simi_left} to={`/singer/detail?id=${item.id}`}>
                                        <img src={item.picUrl} />
                                        <div className={sty.simi_info}>
                                            <div className={sty.simi_name}>{item.name}</div>
                                            <div className={sty.singer_digital}>
                                                {
                                                    item.musicSize && (
                                                        <span className={sty.singer_track}>{formartNum(item.musicSize)}单曲</span>
                                                    )
                                                }
                                                {
                                                    item.albumSize && (
                                                        <span className={sty.singer_album}>{formartNum(item.albumSize)}专辑</span>
                                                    )
                                                }
                                                {
                                                    item.mvSize && (
                                                        <span className={sty.singer_mv}>{formartNum(item.mvSize)}MV</span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </Link>
                                    <div className={sty.simi_oper}>
                                        <span className={`${sty.singer_btn} ${sty.singer_collect} ${item.followed ? 'active' : '' }`} onClick={followArtist(item, 'list')}>
                                            <i className={`iconfont icon-collect${item.followed ? '-active' : ''}`}></i>{ item.followed ? '已关注' : '关注TA'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
