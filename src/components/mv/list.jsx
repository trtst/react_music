import React, { memo } from 'react';
import { Skeleton } from 'antd';
import sty from './scss/list.module.scss';
import MvItem from './item';

// lists: 数据列表
// loading: 加载状态
// count: 初始化加载几条
// row: 一行几条
export default memo(function MvList({ lists, loading, count = 10, row = 5 }) {
    return (
        <div className={sty.mvList}>
            {
                !loading || lists.length > count ?
                    lists.map((list, index) => 
                        <MvItem list={list} key={`mv_${list.id}_${index}`} row={row} />
                    ) :
                ''
            }
            {
                loading &&
                [...new Array(count)].map((item, index) => 
                    <div className={`${sty.item} ${row != 5 ? 'row_' + row : ''}`} key={index}>
                        <Skeleton.Node active={true} block={true} className='skeleton-img'>
                            <i className="iconfont icon-mvlist"></i>
                        </Skeleton.Node>
                        <div className={sty.info}>
                            <Skeleton.Button active={true} size={'small'} block={true} style={{width: '80%'}} />
                            <Skeleton.Button active={true} size={'small'} block={true} style={{width: '60%'}} />
                            <Skeleton.Button active={true} size={'small'} />
                        </div>
                    </div>
                )
            }
        </div>
    )
});
