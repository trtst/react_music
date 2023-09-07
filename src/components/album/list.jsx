import React, { memo } from 'react';
import Item from './item';
import { Skeleton } from 'antd';
import listSty from './scss/list.module.scss';

export default memo(function AlbumList({ lists, loading, count = 6 }) {

    return (
        <div className={listSty.albumList}>
            {
                loading ?
                [...new Array(count)].map((item, index) => 
                    <div className={listSty.item} key={index}>
                        <Skeleton.Image active={true} block={true} className='skeleton-img' />
                        <div className={listSty.info}>
                            <Skeleton.Button active={true} size={'small'} block={true} className='info_title' />
                            <Skeleton.Button active={true} size={'small'} />
                            <Skeleton.Button active={true} size={'small'} />
                        </div>
                    </div>
                ) :
                (lists.map(list => 
                    <Item list={list} key={list.id}/>
                ))
            }
        </div>
    )
})
