import React, { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { playListInfoStore, loginStore } from '@store/index';
import sty from './scss/index.module.scss';
/* 
    lists: 歌曲列表
    typeSize: 播放列表展示类型, 默认是歌单下的展示列表, mini是播放条下的歌曲列表的 
    isScroll: 歌单下的列表是分页, 播放列表是无限滚动
    pageSize: 分页 每页展示数量
*/
const LIMIT = 7;  // 播放列表一页默认7首歌曲
export default memo(function SongList({ lists, typeSize = '', pageSize = 20, isScroll = false, loading = true }) {
    const [ curPage, setCurPage ] = useState(1);

    const [ isPlayed, playListStore, playIndexStore, curSongInfo, setPlayIndex, selectPlay, setPlayList, setPlayed, addToList ] = playListInfoStore( state => [
        state.isPlayed,
        state.playList,
        state.playIndex,
        state.playList[state.playIndex],
        state.setPlayIndex,
        state.selectPlay,
        state.setPlayList,
        state.setPlayed,
        state.addToList
    ]);
    const isLogin = loginStore(state => state.isLogin );
    // 渲染歌单列表，表格列表序号格式化
    const indexMethod = useMemo(() => {
        return page => {
            if (!isScroll) {
                return (curPage - 1) * pageSize + page + 1
            } else {
                return page + 1
            }
        }
    }, [curPage]);
    // 播放列表样式
    const classSty = useMemo(() => {
        return item => `${sty.listItem} ${ isPlayed && (item.id === curSongInfo.id) ? 'active' : ''} ${(item.license || item.vip) ? 'disable' : ''} ${item.vip ? 'vip' : ''}`;
    }, [isPlayed, curSongInfo]);
    // 当前播放歌曲icon状态
    const playIcon = useMemo(() => {
        return item => `iconfont ${sty.playicon} ${ isPlayed && (item.id === curSongInfo.id) ? 'icon-pause' : 'icon-play'}`;
    }, [isPlayed, curSongInfo]);

    // 1、列表点击播放/暂停当前音乐
    const playCurrentSong = (item) => {
        return () => {
            // 若当前唔歌曲 或者 当前播放歌曲不是本歌单显示的歌曲  立即播放当前歌单
            if (!curSongInfo || curSongInfo.id != item.id) {
                selectPlay([item]);
            } else {
                setPlayed(!isPlayed);
            }
        }
    };

    // 添加当前歌曲到播放列表
    const addSongList = (item) => {
        return () => addToList([item])
    };

    // 在播放列表删除歌曲，播放列表、播放索引重置更新
    const delItem = (index) => {
        return () => {
            if (playListStore.length > 1) {
                playListStore.splice(index, 1);
                
                if (playIndexStore >= index) {
                    setPlayIndex(playIndexStore - 1);
                }
                setPlayList(playListStore);
            } else {
                setPlayList();
            }

            // 从倒数删除播放列表歌曲时，滚动条回到正确的位置
            if (playListStore.length + 1 > LIMIT && playListStore.length + 1 - index <= LIMIT) {
                setCurScrollSty(curScrollSty + 50 );
            }
        }
    };

    // 列表分页渲染数据
    // 未登录&播放列表不显示分页
    const paginationInfo = useMemo(() => 
        typeSize == 'mini' ? false : (isLogin ? {
            onChange: (page) => {
                setCurPage(page);
            },
            pageSize: 20,
            align: 'center',
            showSizeChanger: false
        } : false)
    , [ typeSize, isLogin ]);
    
    // 自动滚动到当前播放音乐的位置
    const [curScrollSty, setCurScrollSty ] = useState(0);
    const curSongRef = useRef();
    // 当前播放歌曲滚动到播放列表中间
    const scrollCurSong = useCallback(() => {
        const curIndex = playListStore.findIndex(item => {
            return item.id === curSongInfo.id
        });
        let num = 0, max = LIMIT;

        if (curIndex < Math.ceil(max / 2) || playListStore.length <= max) {
            num = 0;
        } else if (curIndex >= playListStore.length - max && (curIndex >= playListStore.length - Math.ceil(max / 2)) && playListStore.length > max) {
            num = -(playListStore.length - max) * 50;
        } else {
            num = -(curIndex - Math.floor(max / 2)) * 50;
        }

        setCurScrollSty(num);
    }, [curSongInfo, playListStore]);

    const curSongSty = useMemo(() => {
        return { transform: `translateY(${curScrollSty}px)` };
    }, [curScrollSty]);

    // 播放列表滚动效果
    const wheelHandler = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.wheelDelta > 0 || e.detail < 0) {
            setCurScrollSty(Math.abs(curScrollSty) > 0 ? curScrollSty + 50 : 0);
        } else {
            setCurScrollSty(Math.abs(curScrollSty) < (playListStore.length - LIMIT) / 2 * 100 ? curScrollSty - 50 : curScrollSty);
        }
    };

    useEffect(() => {
        // 播放列表滚动时，防止body页面也跟随滚动
        if (isScroll && curSongRef.current) {
            const $curSongRef = curSongRef.current;
            $curSongRef.addEventListener('wheel', wheelHandler, {passive: false});
        }

        return () => {
            if (isScroll && curSongRef.current) {
                const $curSongRef = curSongRef.current;
                $curSongRef.removeEventListener('wheel', wheelHandler);
            }
        }
        // react中dom监听方法内值不更新,addEventListener里面形成闭包了
    }, [curScrollSty, playListStore]);

    useEffect(() => {
        isScroll && scrollCurSong();
    }, [curSongInfo]);

    return (
        <div className={`${sty.songListMain} ${typeSize == 'mini' ? sty.mini : ''}`}>
            <div className={sty.listHeader}>
                <div className={sty.columnIndex}>序号</div>
                <div className={sty.columnSong}>歌曲</div>
                <div className={sty.columnSinger}>歌手</div>
                { typeSize != 'mini' && <div className={sty.columnAlbum}>专辑</div>}
                <div className={sty.columnTime}>时长</div>
            </div>
            <div className={sty.list_scroll} ref={curSongRef}>
                <div className={sty.list_main} style={curSongSty} >
                    {
                        loading ?
                        [...new Array(pageSize)].map((item, index) => 
                            <div className={sty.listItem} key={index}>
                                <Skeleton.Button active={true} size={'small'} block={true} />
                            </div>
                        ) :
                        <List
                            pagination = {paginationInfo}
                            dataSource = {lists}
                            renderItem = {(item, index) => (
                                <List.Item
                                    key={item.id}
                                    className={classSty(item)}
                                >
                                    <div className={sty.columnIndex}>
                                        <span className={sty.itemIndex}>{indexMethod(index)}</span>
                                        <div className={sty.audioIcon}>
                                            <div className={sty.column} style={{animationDelay: "-1.2s"}}></div>
                                            <div className={sty.column}></div>
                                            <div className={sty.column} style={{animationDelay: "-1.5s"}}></div>
                                            <div className={sty.column} style={{animationDelay: "-0.9s"}}></div>
                                            <div className={sty.column} style={{animationDelay: "-0.6s"}}></div>
                                        </div>
                                        <i className={playIcon(item)} onClick={playCurrentSong(item)}></i>
                                    </div>
                                    <div className={`${sty.columnSong} ${sty.songName}`}>
                                        <Link to={`/song?id=${item.id}`} className={sty.songTitle}>{ item.name }</Link>
                                        {
                                            typeSize !== 'mini' && item.mvId && (<Link className={sty.mvName} to={`/mv?id=${item.mvId}`}><i className="iconfont icon-mvlist"></i></Link>)
                                        }
                                        {
                                            typeSize !== 'mini' && item.vip && (<i className="iconfont icon-vip"></i>)
                                        }
                                    </div>
                                    <div className={`${sty.columnSinger} ${sty.singer}`}>
                                        {
                                            item.singer.map((author,k) => 
                                                <Fragment key={author.id}>
                                                    <Link to={`/singer/detail?id=${author.id}`} className={sty.songSinger}>{ author.name }</Link><span>/</span>
                                                </Fragment>
                                            )
                                        }
                                    </div>
                                    {
                                        typeSize !== 'mini' && (
                                            <div className={sty.columnAlbum}>
                                                <Link className={sty.album} to={`/album?id=${item.album.id}`}>{ item.album.name }</Link>
                                            </div>
                                        )
                                    }
                                    <div className={sty.columnTime}>
                                        <div className={sty.time}>
                                            {item.duration}
                                        </div>
                                        <div className={sty.oper}>
                                            { typeSize !== 'mini' && (<i className="iconfont icon-add" title="添加到列表" onClick={addSongList(item)}></i>) }
                                            <i className="iconfont icon-collect" title="收藏"></i>
                                            { typeSize == 'mini' && (<i className="iconfont icon-del" title="删除" onClick={delItem(index)}></i>) }
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        >
                        </List>
                    }
                </div>
            </div>
        </div>
    )
});
