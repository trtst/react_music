import React, { useEffect, useState, memo } from 'react';
import { hotPlayList, playList } from '@apis/http.js';
import Card from './card';
import PlayList from '@components/playlist/list';

const LIMIT = 6;

export default memo(function Hot() {
    const [ tags, setTags ] = useState([]);  // 热门标签列表
    const [ lists, setLists ] = useState([]);   // 热门歌单数据
    const [ loading, setLoading ] = useState(true);

    // 热门标签切换
    const getIndex = (idx) => {
        getPlayList(idx);
    }

    useEffect(() => {
        getHotTags();
        getPlayList();
    }, []);

    // 获取热门推荐歌单标签
    async function getHotTags() {
        const { data: res } = await hotPlayList()

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        const newList = [].concat([{ name: '为您推荐' }], res.tags.splice(0, LIMIT));

        setTags(newList);
    }

    // 获取热门歌单列表
    async function getPlayList (idx = 0) {
        setLoading(true);
        const { data: res } = await playList({limit: LIMIT, offset: 0, cat: tags.length && idx != 0 ? tags[idx]['name'] : ''})

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setLists([].concat(res.playlists));
        setLoading(false);
    }

    return (
        <Card title="热门推荐" type="recomd" getIndex={getIndex} tags={tags}>
            <PlayList lists={lists} loading={loading} count={LIMIT} />
        </Card>
    )
})
