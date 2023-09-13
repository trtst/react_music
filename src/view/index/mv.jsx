import React, { memo, useCallback, useEffect, useState } from 'react';
import Card from './card';
import { MV_AREA } from '@utils/index';
import { mv } from '@apis/http.js';
import MvList from '@components/mv/list';

const LIMIT = 10;

export default memo(function Mv() {
    const [ lists, setLists ] = useState([]);   // 热门MV数据
    const [ loading, setLoading ] = useState(true);

    // 热门标签切换
    const getIndex = useCallback((idx) => {
        getMvList(idx);
    }, []);

    // 最新MV
    const getMvList = async(idx = 0) => {
        setLoading(true);
        const { data: res } = await mv({ limit: LIMIT, offset: 0, area: MV_AREA[idx]['name'] })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setLists(res.data)
        setLoading(false);
    };

    useEffect(() => {
        getMvList();
    }, []);

    return (
        <Card title="最新MV" type="mv" getIndex={getIndex} tags={MV_AREA}>
            <MvList lists={lists} loading={loading} count={LIMIT} />
        </Card>
    )
})
