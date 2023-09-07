import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routeList from './route';

export default function Router() {
    const routerList = useRoutes(routeList);

    return (
        <Suspense fallback={<div>加载中。。。</div>}>
            {routerList}
        </Suspense>
    )
};