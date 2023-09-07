import React, { memo } from 'react';
import { Skeleton } from 'antd';
import listSty from './scss/list.module.scss';
import DjItem from './item';

export default memo(function DjList({ lists, loading, count }) {

    return (
        <div className={listSty.djMain}>
            {
                loading ?
                [...new Array(count)].map((item, index) => 
                    <div className={listSty.djItem} key={index}>
                        <div className={listSty.faceImg}>
                            <Skeleton.Image active={true} block={true} className='skeleton-img' />
                        </div>
                        <div className={listSty.info}>
                            <Skeleton.Button active={true} size={'small'} block={true} />
                            <Skeleton.Button active={true} size={'small'} block={true} style={{width: '80%'}} />
                            <Skeleton.Button active={true} size={'small'} block={true} style={{width: '60%'}} />
                        </div>
                    </div>
                ) :
                (lists.map(list => 
                    <DjItem list={list} key={list.id} />
                ))
            }
        </div>
    )
})
