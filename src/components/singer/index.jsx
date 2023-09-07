import React, { useContext } from 'react';
import Item from './item';
import { Skeleton } from 'antd';
import sty from './scss/index.module.scss';

export default function Singer({ ctx, count = 6}) {
    const { lists, loading } = useContext(ctx);

    return (
        <div className={sty.singer_main}>
            {
                !loading || lists.length > count ?
                    lists.map((list, index) => 
                        <Item list={list} key={`${list.id}item${index}`} ctx={ctx} />
                    ) :
                ''
            }
            {
                loading &&
                [...new Array(count)].map((item, index) => 
                    <div className={`${sty.singer_item} ${sty.singer_item_load}`} key={index}>
                        <Skeleton.Image active={true} block={true} className='skeleton-img' />
                        <div className={sty.item_info}>
                            <Skeleton.Button active={true} size={'small'} block={true} className='info_title' />
                            <div className={sty.item_count}>
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
}
