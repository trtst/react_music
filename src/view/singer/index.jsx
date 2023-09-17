import React, { createContext, memo, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { App } from 'antd';
import Singer from '@components/singer';
import { ARTIST_AREA, ARTIST_TYPE } from '@utils/area';
import { artistList, artistSub } from '@apis/http';
import sty from './scss/index.module.scss';

const SINGER = createContext();

let initial = [];

const renderInitial = () => {
    const alphabet = []
    for (let i = 0; i < 26; i++) {
        alphabet.push({
            label: String.fromCharCode(65 + i),
            val: String.fromCharCode(97 + i)
        })
    }

    initial = [{ label: '热门', val: -1 }, ...alphabet, { label: '#', val: 0 }];
};

renderInitial();
export default memo(function SingerList() {
    const { message } = App.useApp();
    const [ lists, setLists ] = useState([]);           // 歌手列表
    const [ loading, setLoading ] = useState(true); 
    const [ hasMore, setHasMore ] = useState(false); 
    const [ isOperEnd, setIsOperEnd ] = useState({
        id: '',
        state: true
    }); 
    const [ params, setParams ] = useState({
        area: ARTIST_AREA[0].val,
        type: ARTIST_TYPE[0].val,
        initial: -1,
        limit: 30,
        offset: 0,
        timestamp: new Date().getTime()
    });

    // 获取歌手列表
    const getArtist = async () => {
        setLoading(true);
        const { data: res } = await artistList(params)

        if (res.code !== 200) {
            return message.error({
                content: res.message
            });
        }
        const newList = params.offset !== 0 ? [...lists, ...res.artists] : res.artists;
        
        setLists(newList);
        setLoading(false);
        setHasMore(res.more);
    };

    // 收藏与取消歌手
    // const singerRef = useRef();  无状态子组件无法使用ref
    const followHandler = useCallback(async(par) => {
        setIsOperEnd({
            id: par.id,
            state: false
        });
        const { data: res } = await artistSub({ id: par.id, t: Number(!par.followed)});
    
        if (res.code !== 200) {
            return message.error({
                content: res.message
            });
        }

        message.success({
            content: '操作成功~'
        });
        const newList = [...lists];
        const curItem = newList.find(item => item.id == par.id);

        curItem.followed = Number(!par.followed);

        setLists(newList);
        setIsOperEnd({
            id: par.id,
            state: true
        });
    }, [lists]);

    // 加载更多
    const loadMore = () => {
        if (!loading) {
            const newParams = {...params, offset: lists.length };

            setParams(newParams)
        }
    };

    // 切换类别
    const selectType = (type, val) => {
        return () => {
            setLists([]);
            setParams({...params, [type]: val, offset: 0});
        }
    };

    useEffect(() => {
        renderInitial();
    }, []);

    useEffect(() => {
        getArtist();
    }, [params]);

    return (
        <>
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
})
