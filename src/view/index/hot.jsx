import React, { useEffect, useState, memo, useCallback } from 'react';
import { hotPlayList, playList } from '@apis/http.js';
import { App } from 'antd';
import Card from './card';
import PlayList from '@components/playlist/list';

const LIMIT = 6;

export default memo(function Hot() {
    const { message } = App.useApp();
    const [ tags, setTags ] = useState([]);  // 热门标签列表
    const [ lists, setLists ] = useState([]);   // 热门歌单数据
    const [ loading, setLoading ] = useState(true);

    // 热门标签切换
    const getIndex = useCallback((idx) => {
        getPlayList(idx);
    }, [tags]);

    useEffect(() => {
        getHotTags();
        getPlayList();
    }, []);

    // 获取热门推荐歌单标签
    const getHotTags = async () => {
        const { data: res } = await hotPlayList();

        if (res.code !== 200) {
            return message.error({
                content: res.message
            });
        }

        const newList = [].concat([{ name: '为您推荐' }], res.tags.splice(0, LIMIT));

        setTags(newList);
    };

    // 获取热门歌单列表
    const getPlayList = async (idx = 0) => {
        setLoading(true);
        const { data: res } = await playList({limit: LIMIT, offset: 0, cat: tags.length && idx != 0 ? tags[idx]['name'] : ''})

        if (res.code !== 200) {
            return message.error({
                content: res.message
            });
        }

        setLists([].concat(res.playlists));
        setLoading(false);
    };

    return (
        <Card title="热门推荐" type="recomd" getIndex={getIndex} tags={tags}>
            <PlayList lists={lists} loading={loading} count={LIMIT} />
        </Card>
    )
})
