import React, { useEffect, useState, memo, useCallback } from 'react';
import Card from './card';
import { App } from 'antd';
import AlbumList from '@components/album/list';
import { topAlbum } from '@apis/http.js';
import { ALBUM_AREA } from '@utils/area';

const LIMIT = 6;

export default memo(function Album() {
    const { message } = App.useApp();
    const [ lists, setLists ] = useState([]);   // 热门歌单数据
    const [ loading, setLoading ] = useState(true);

    // 热门标签切换
    const getIndex = useCallback((idx) => {
        getAlbumList(idx);
    });

    useEffect(() => {
        getAlbumList();
    }, []);

    // 新碟上架
    const getAlbumList = async (idx = 0) => {
        setLoading(true);
        const { data: res } = await topAlbum({limit: LIMIT, offset: 0, area: ALBUM_AREA[idx]['code']})

        if (res.code !== 200) {
            return message.error({
                content: res.message
            });
        }

        setLists(res.monthData.slice(0, LIMIT));
        setLoading(false);
    };

    return (
        <Card title="新碟上架" type="album" getIndex={getIndex} tags={ALBUM_AREA}>
            <AlbumList lists={lists} loading={loading} count={LIMIT} />
        </Card>
    )
});