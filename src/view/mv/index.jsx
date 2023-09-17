import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MV_AREA, MV_TYPE } from '@utils/area';
import { mv } from '@apis/http';
import { App } from 'antd';
import MvList from '@components/mv/list';
import sty from './scss/index.module.scss';

const MV_ORDER = ['上升最快', '最新'];

export default function Mv() {
    const { message } = App.useApp();
    const [ lists, setLists ] = useState([]);      //视频列表
    const [ loading, setLoading ] = useState(true); 
    const [ hasMore, setHasMore ] = useState(false); 
    const [ params, setParams ] = useState({
        area: MV_AREA[0].name,
        type: MV_TYPE[0],
        order: MV_ORDER[0],
        limit: 30,
        offset: 0
    });

    // 获取视频MV列表
    const getMv = async(params) => {
        setLoading(true);
        const { data: res } = await mv(params)

        if (res.code !== 200) {
            return message.error({
                content: res.message
            });
        }

        const newList = params.offset !== 0 ? [...lists, ...res.data] : res.data;
        
        setLists(newList);
        setLoading(false);
        setHasMore(res.hasMore);
    };

    // 切换类别
    const selectType = (type, val) => {
        return () => {
            setLists([]);
            setParams({...params, [type]: val, offset: 0});
        }
    };

    // 加载更多
    const loadMore = () => {
        if (!loading) {
            const newParams = {...params, offset: lists.length };

            getMv(newParams);
        }
    };

    useEffect(() => {
        getMv(params);
    }, [params]);

    return (
        <div className={sty.mv}>
            <div className={sty.mv_filter}>
                <div className={sty.filter_header}>
                    <i className="iconfont icon-filter"></i><span>筛选类别</span> ( <em>排序</em> · <em>区域</em> · <em>类型</em> )
                </div>
                <div className={sty.filter_main}>
                    <div className={sty.filter_item}>
                        <span></span>
                        {
                            MV_ORDER.map(item => (
                                <em className={item === params.order ? 'active' : ''} key={item} onClick={selectType('order', item)}>{item}</em>
                            ))
                        }
                    </div>
                    <div className={sty.filter_item}>
                        <span></span>
                        {
                            MV_AREA.map(item => (
                                <em className={item.name === params.area ? 'active' : ''} key={item.name} onClick={selectType('area', item.name)}>{item.name}</em>
                            ))
                        }
                    </div>
                    <div className={sty.filter_item}>
                        <span></span>
                        {
                            MV_TYPE.map(item => (
                                <em className={item === params.type ? 'active' : ''} key={item} onClick={selectType('type', item)}>{item}</em>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={sty.mv_main}>
                <InfiniteScroll
                        dataLength={lists.length}
                        next={loadMore}
                        hasMore={hasMore}
                    >
                    <MvList lists={lists} loading={loading} isScroll={true} />
                </InfiniteScroll>
            </div>
        </div>
    )
}
