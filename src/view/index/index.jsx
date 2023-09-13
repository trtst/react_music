import React, { useState } from 'react';
import Banner from './banner';
import Hot from './hot';
import Album from './album';
import Rank from './rank';
import Mv from './mv';
import Dj from './dj';
import Singer from './singer';

export default function Index() {
    const [ count, setCount ] = useState(0);

    const add = () => {
        setCount(count => count + 1);
    }
    return (
        <>
            <div onClick={add}>当前数字： {count}</div>
            <Banner />
            <Hot />
            <Album />
            <Rank />
            <Mv />
            <div className="car-box">
                <Dj />
                <Singer />
            </div>           
        </>
    )
}
