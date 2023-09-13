import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { message } from 'antd';
import Singer from '@components/singer';
import { ARTIST_AREA, ARTIST_TYPE } from '@utils/area';
import { artistList, artistSub } from '@apis/http';
import sty from './scss/index.module.scss';

const SINGER = createContext();

export default function SingerList() {
    const [ messageApi, contextHolder ] = message.useMessage();
    const [ initial, setinitial ] = useState([{ label: '热门', val: -1 }, { label: '#', val: 0 }]);
    const [ lists, setLists ] = useState([]);      //歌手列表
    const [ loading, setLoading ] = useState(true); 
    const [ hasMore, setHasMore ] = useState(false); 
    const [ isOperEnd, setIsOperEnd ] = useState({
        id: '',
        state: true
    }); 
    const [ params, setParams ] = useState({
        area: ARTIST_AREA[0].val,
        type: ARTIST_TYPE[0].val,
        initial: initial[0].val,
        limit: 30,
        offset: 0,
        timestamp: new Date().getTime()
    });

    const renderInitial = () => {
        const alphabet = []
        for (let i = 0; i < 26; i++) {
            alphabet.push({
                label: String.fromCharCode(65 + i),
                val: String.fromCharCode(97 + i)
            })
        }

        const newinitial = [initial[0], ...alphabet, initial[1]];
        setinitial(newinitial);
    };

    // 获取歌手列表
    const getArtist = async (params) => {
        setLoading(true);
        const { data: res } = await artistList(params)

        if (res.code !== 200) {
            return messageApi.open({
                type: 'error',
                content: res.message,
            });
        }
        const newList = params.offset !== 0 ? [...lists, ...res.artists] : res.artists;
        
        setLists(newList);
        setLoading(false);
        setHasMore(res.more);
    };

    // 收藏与取消歌手
    // const singerRef = useRef();  无状态子组件无法使用ref
    const followHandler = async(par) => {
        setIsOperEnd({
            id: par.id,
            state: false
        });
        const { data: res } = await artistSub({ id: par.id, t: Number(!par.followed)});
    
        if (res.code !== 200) {
            return messageApi.open({
                type: 'error',
                content: res.message,
            });
        }

        messageApi.open({
            type: 'success',
            content: '操作成功~',
        });
        const newList = [...lists];
        const curItem = newList.find(item => item.id == par.id);

        curItem.followed = Number(!par.followed);

        setLists(newList);
        setIsOperEnd({
            id: par.id,
            state: true
        });
    };

    // 加载更多
    const loadMore = () => {
        if (!loading) {
            const newParams = {...params, offset: lists.length };

            getArtist(newParams);
        }
    };

    // 切换类别
    const selectType = useCallback((type, val) => {
        return () => {
            setLists([]);
            setParams({...params, [type]: val, offset: 0});
        }
    });

    useEffect(() => {
        renderInitial();
    }, []);

    useEffect(() => {
        getArtist(params);
    }, [params]);

    return (
        <>
            {contextHolder}
            <div className={sty.singer}>
                <div className={sty.singer_filter}>
                    <div className={sty.filter_header}>
                        <i className="iconfont icon-filter"></i><span>筛选列表</span>
                    </div>
                    <div className={sty.filter_main}>
                        <div className={sty.filter_item}>
                            {
                                initial.map((item, index) => (
                                    <em className={item.val === params.initial ? 'active' : ''} key={item.label} onClick={selectType('initial', item.val)}>{item.label}</em>
                                ))
                            }
                        </div>
                        <div className={sty.filter_item}>
                            {
                                ARTIST_AREA.map((item, index) => (
                                    <em className={item.val === params.area ? 'active' : ''} key={item.label} onClick={selectType('area', item.val)}>{item.label}</em>
                                ))
                            }
                        </div>
                        <div className={sty.filter_item}>
                            {
                                ARTIST_TYPE.map((item, index) => (
                                    <em className={item.val === params.type ? 'active' : ''} key={item.label} onClick={selectType('type', item.val)}>{item.label}</em>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <SINGER.Provider value={{ lists, loading, followHandler, isOperEnd}}>
                    <div className={sty.singer_main}>
                        <InfiniteScroll
                                dataLength={lists.length}
                                next={loadMore}
                                hasMore={hasMore}
                            >
                            <Singer ctx={SINGER} />
                        </InfiniteScroll>
                    </div>
                </SINGER.Provider>
            </div>
        </>
    )
}
