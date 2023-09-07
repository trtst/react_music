import React, { useEffect, useState, memo } from 'react';
import Card from './card';
import AlbumList from '@components/album/list';
import { topAlbum } from '@apis/http.js';
import { ALBUM_AREA } from '@utils/area';

const LIMIT = 6;

export default memo(function Album() {
    const [ lists, setLists ] = useState([]);   // 热门歌单数据
    const [ loading, setLoading ] = useState(true);

    // 热门标签切换
    const getIndex = (idx) => {
        getAlbumList(idx);
    };

    useEffect(() => {
        getAlbumList();
    }, []);

    // 新碟上架
    async function getAlbumList (idx = 0) {
        setLoading(true);
        const { data: res } = await topAlbum({limit: LIMIT, offset: 0, area: ALBUM_AREA[idx]['code']})

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setLists(res.monthData.slice(0, LIMIT));
        setLoading(false);
    }

    return (
        <Card title="新碟上架" type="album" getIndex={getIndex} tags={ALBUM_AREA}>
            <AlbumList lists={lists} loading={loading} count={LIMIT} />
        </Card>
    )
});