import React, { useState, memo } from 'react';
import cardSty from './scss/card.module.scss';

export default memo(function Card({ title, tags, children, getIndex}) {
    const [ idx, setIdx] = useState(0);

    const chooseTag = index => {
        return () => {
            getIndex(index);
            setIdx(index);
        }
    }

    return (
        <div className={cardSty.card}>
            <div className={cardSty['card-title']}>
                <h3>{ title }</h3>
                {
                    tags && tags.map((tag, index) => 
                        <span 
                            key={tag.name}
                            className={index == idx ? 'active' : ''}
                            onClick={chooseTag(index)}
                        >
                            {tag.name}
                        </span>
                    )
                }
            </div>
            <div className={cardSty['card-body']}>
                {
                    children
                }
            </div>
        </div>
    )
})
