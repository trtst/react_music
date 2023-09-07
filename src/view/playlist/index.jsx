import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import PlayListMain from '@components/playlist/list';
import { catlist, playList } from '@apis/http';
import plSty from './scss/index.module.scss';

const allType = '全部歌单';
const params = {
    order: 'hot',
    cat: allType,
    limit: 48,
    offset: 0
};

export default function PlayList() {
    const location = useLocation();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const cat = searchParams.get('cat') ?? allType;
    const [ curType, setCurType ] = useState(allType);   // 当前分类
    const [ categories, setCategories ] = useState([]);    // 分类筛选数据
    const [ lists, setLists ] = useState([]);              // 当前分类下的歌单列表
    const [ loading, setLoading ] = useState(true);
    const [ listLoad, setListLoad ] = useState(true);
    const [ total, setTotal ] = useState(0);

    // 获取分类数据
    const getCatlist = async() => {
        setLoading(true);
        const { data: res } = await catlist();
        const arr = [];
    
        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }
    
        for(let k in res.categories) {
            arr.push({
                name: res.categories[k],
                children: res.sub.filter(idm => idm.category == k)
            })
        }
    
        setCategories(arr);
        setLoading(false);
    };

    // 根据分类获取歌单列表
    const getPlayList = async(param) => {
        setListLoad(true);
        const { data: res } = await playList(param);
    
        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }
    
        const newLists = param.offset !== 0 ? [...lists, ...res.playlists] : res.playlists;

        setLists(newLists);
        setListLoad(false);
        setTotal(res.total);
    };

    // 加载更多
    const loadMore = () => {
        if (!listLoad) {
            const newParams = {...params, offset: lists.length };

            getPlayList(newParams);
        }
    };

    // 切换歌单类别
    const selectType = (item) => {
        return () => {
            setSearchParams({
                cat: item.name,
                order: params.order
            });
        }
    };

    // 重置歌单类型
    const closed = () => {
        setSearchParams();
    };

    // 页面初始化，获取顶部筛选的数据
    useEffect(() => {
        getCatlist();
    }, []);

    // 监听路由参数变化，根据参数获取歌单列表数据
    useEffect(() => {
        const newParams = {...params, offset: 0, cat};

        setLists([]);
        setCurType(cat);
        getPlayList(newParams);
    }, [location]);

    return (
        <div className={plSty.playList}>
            <Spin tip="Loading" spinning={loading}>
                <div className={`${plSty.filter} ${plSty.card}`}>
                    {
                        categories.map(item => (
                            <div className={plSty.filterItem} key={ item.name }>
                                <div className={plSty.filterTitle}>{ item.name }</div>
                                <div className={plSty.filterBox}>
                                    {
                                        item.children.map(sub => (
                                            <span className={`${curType === sub.name ? 'active' : ''}`} key={sub.name} onClick={selectType(sub)}>{sub.name}</span>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Spin>
            <div className={plSty.wrapper}>
                <div className={plSty.listHead}>
                    <h2>
                        {curType}
                        {
                            curType !== allType && (<em className={plSty.filterClose}>
                                <i className="iconfont icon-closed" onClick={closed}></i>
                            </em>)
                        }
                    </h2>
                    <div className={plSty.type}>
                        <span className={params.order === 'hot' ? 'active' : ''}>热门</span>
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={lists.length}
                    next={loadMore}
                    hasMore={lists.length < total}
                >
                    <PlayListMain lists={lists} loading={listLoad} />
                </InfiniteScroll>
            </div>
        </div>
    )
}
