import React from 'react';
import { Spin } from 'antd';
import sty from './index.module.scss';

export default function Loading() {
    return (
        <div className={sty.loading}>
            <Spin size="large" />
        </div>
    )
}
