import React from 'react';
import Banner from './banner';
import Hot from './hot';
import Album from './album';
import Rank from './rank';
import Mv from './mv';
import Dj from './dj';
import Singer from './singer';

export default function Index() {

    return (
        <>
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
