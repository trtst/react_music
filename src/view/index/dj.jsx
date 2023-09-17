import React, { useState, memo, useEffect } from 'react';
import { getHotDj } from '@apis/http.js';
import { App } from 'antd';
import DjList from '@components/dj/list';
import djSty from './scss/dj.module.scss';

const LIMIT = 6;

export default memo(function Dj() {
    const { message } = App.useApp();
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
            return message.error({
                content: res.message
            });
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
