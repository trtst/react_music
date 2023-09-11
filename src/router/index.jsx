import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routeList from './route';
import Loading from '@components/loading';

export default function Router() {
    const routerList = useRoutes(routeList);

    return (
        <Suspense fallback={<Loading />}>
            {routerList}
        </Suspense>
    )
};