import React, { memo } from 'react';
import Item from './item';
import { Skeleton } from 'antd';
import sty from './scss/list.module.scss';

export default memo(function PlayList({ lists, loading, count = 6 }) {
    /*     
        lists: 需要渲染的数据
        loading: 是否加载中，占位符
        count: 每次渲染的个数，默认一排6个
    */

    return (
        <div className={sty.playlist}>
            {
                !loading || lists.length > count ?
                    lists.map((list, index) => 
                        <Item list={list} key={`${list.id}item${index}`}/>
                    ) :
                ''
            }
            {
                loading &&
                [...new Array(count)].map((item, index) => 
                    <div className={sty.item} key={index}>
                        <Skeleton.Image active={true} block={true} className='skeleton-img' />
                        <div className={sty.info}>
                            <Skeleton.Button active={true} size={'small'} block={true} className='info_title' />
                            <Skeleton.Button active={true} size={'small'} />
                            <div className={sty.tags}>
                                <Skeleton.Avatar active={true} size={'small'} />
                                <Skeleton.Avatar active={true} size={'small'} />
                                <Skeleton.Avatar active={true} size={'small'} />
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
})
