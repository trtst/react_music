import React, { useState, memo, useEffect, useCallback } from 'react';
import { getHotDj } from '@apis/http.js';
import DjList from '@components/dj/list';
import djSty from './scss/dj.module.scss';

const LIMIT = 6;

export default memo(function Dj() {
    const [ lists, setLists ] = useState([]);   // 热门歌单数据
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        getHotDjHandler();
    }, []);

    // 获取私人电台
    const getHotDjHandler = async() => {
        setLoading(true);
        const { data: res } = await getHotDj({ limit: LIMIT })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setLists(res.djRadios);
        setLoading(false);
    };

    return (
        <div className={djSty.dj}>
            <div className={djSty.djTitle}>
                热门电台
            </div>
            <DjList lists={lists} loading={loading} count={LIMIT} />
        </div>
    )
})
