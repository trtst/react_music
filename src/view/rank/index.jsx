import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { topListDetail, playListDetail } from '@apis/http';
import { formatSongs, formartDate, formartNum } from '@utils/index';
import SongList from '@components/songlist';
import rankSty from './scss/index.module.scss';
import { Spin } from 'antd';

const RANKTYPE = [{
    name: 'TOP榜',
    type: 'Top'
}, {
    name: '特色榜',
    type: 'Feature'
}, {
    name: '场景榜',
    type: 'Other'
}];
let total = 0;

export default function Rank() {
    const navigate = useNavigate();
    const [ params ] = useSearchParams();
    const [ rid, setRid ] = useState();
    const [ category, setCategory ] = useState([]);
    const [ info, setInfo ] = useState({});
    const [ songList, setSongList ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    // 获取排行榜场景列表
    const getRankTypeList = async() => {
        const { data: res } = await topListDetail();
        const rankList = [];

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        RANKTYPE.forEach(rankinfo => {
            let obj = {};
            obj['title'] = rankinfo.name;
            obj['list'] = res.list.filter(item => {
                let flag = false;

                switch(rankinfo.type) {
                    case 'Top':  // 云音乐TOP榜
                        flag = item.ToplistType;
                        break;
                    case 'Feature':  // 云音乐特色榜
                        flag = !item.ToplistType && item.name.indexOf('云音乐') >= 0;
                        break;
                    case 'Other':  // 其他场景榜
                        flag = !item.ToplistType && item.name.indexOf('云音乐') < 0;
                        break;
                }
                return flag;
            });

            rankList.push(obj);
        });

        setCategory(rankList);
        setRid(() => params.get('rid') ?? rankList[0].list[0].id );
    };
    // 获取排行榜详情
    const getListDetail = async() => {
        setLoading(true);
        const { data: res } = await playListDetail({ id: rid, s: -1 })
    
        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }
        const all = formatSongs(res.playlist.tracks, res.privileges);

        setInfo(res.playlist);
        setSongList(all);
        total = all.length;
        setLoading(false);
    };

    useEffect(() => {
        getRankTypeList();
    }, []);

    // 切换排行榜
    const selectItem = (item) => {
        return () => {
            setRid(item.id);
            navigate(`/rank?rid=${item.id}`);
        }
    };

    useEffect(() => {
        if(rid) {
            getListDetail();
        }
    }, [rid]);

    return (
        <div className={rankSty.rank}>
            <div className={rankSty.rankMain}>
                <Spin tip="Loading" spinning={loading}>
                    <div className={rankSty.cover}>
                        <div className={rankSty.coverImg}>
                            <img src={info.coverImgUrl} />
                        </div>
                        <div className={rankSty.coverInfo}>
                            <div className={rankSty.coverHeader}>
                                <div className={rankSty.coverTitle}>
                                    {info.name || 'XXX'} <span>({formartDate(info.updateTime, 'MM月dd日')} 更新)</span>
                                </div>
                            </div>
                            <div className={rankSty.coverAuthor}>
                                <img className={rankSty.coverAvatar} src={info.creator?.avatarUrl} />
                                <div className={rankSty.coverName}>{info.creator?.nickname || 'XXX'}</div>
                                <div className={rankSty.coverDate}>{formartDate(info.createTime, 'yyyy-MM-dd')}</div>
                            </div>
                            <div className={rankSty.coverDigital}>
                                <span className={rankSty.coverPlayCount}><i className="iconfont icon-playnum"></i> {formartNum(info.playCount)}次</span>
                                <span className={rankSty.coverCollect}><i className="iconfont icon-collect"></i> {formartNum(info.subscribedCount)}</span>
                                <span className={rankSty.coverComment}><i className="iconfont icon-comment"></i> {formartNum(info.commentCount)}</span>
                            </div>
                            <div className={rankSty.coverDesc}>
                                <h5 className={rankSty.coverDescTitle}>歌单简介</h5>
                                <p className={rankSty.coverDescText}>{info.description || 'XXX'}</p>
                            </div>
                        </div>
                    </div>
                </Spin>
                <div className={rankSty.songMain}>
                    <div className={rankSty.songHeader}>
                        <h4>歌曲列表 <em>{total + '首歌'}</em></h4>
                        <span className={rankSty.playAll}><i className="iconfont icon-audio-play"></i> 播放全部</span>
                        <span className={rankSty.collect}><i className={`iconfont icon-collect${info.subscribed ? '-active' : ''}`}></i> { info.subscribed ? '已收藏' : '收藏'}</span>
                    </div>
                    <SongList lists={songList} loading={loading} />
                </div>
            </div>
            <div className={rankSty.rankSide}>
                {
                    category.length ?
                    category.map(item => 
                        <div className={rankSty.sideItem} key={item.title}>
                            <div className={rankSty.sideItemTitle}> {item.title} </div>
                            <div className={rankSty.sideItemMain}>
                                {
                                    item.list.map(list => 
                                        <div className={`${rankSty.sideItemBox} ${ list.id == rid ? 'active' : ''}`} onClick={selectItem(list)} key={list.id}>
                                            <img className={rankSty.itemImg} src={list.coverImgUrl} />
                                            <div className={rankSty.itemInfo}>
                                                <div className={rankSty.itemTitle}>
                                                    {list.name}
                                                </div>
                                                <div className={rankSty.itemTime}>
                                                    {list.updateFrequency}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ) :
                    ''
                }
            </div>
        </div>
    )
}
