import { lazy } from 'react';
import { Navigate } from "react-router-dom";
const Index = lazy(() => import('@view/index'));
const Rank = lazy(() => import('@view/rank'));
const PlayList = lazy(() => import('@view/playlist'));
const PlayListDetail = lazy(() => import('@view/playlist/detail'));
const Mv = lazy(() => import('@view/mv'));
const Singer = lazy(() => import('@view/singer'));
const SingerDetail = lazy(() => import('@view/singer/detail'));
const SongDetail = lazy(() => import('@view/song'));
const User = lazy(() => import('@view/user'));
const NotFound = lazy(() => import('@view/404'));

const routeList = [
    {
        path: "/",
        icon: 'index',
        name: "首页",
        isNav: true,
        element: <Index />
    },
    {
        path: "/index",
        icon: 'index',
        name: "首页",
        element: <Navigate to='/' />
    },
    {
        path: "/rank",
        icon: 'rank',
        name: "排行榜",
        isNav: true,
        element: <Rank />
    },
    {
        path: "/playlist",
        icon: 'playlist',
        name: "歌单",
        isNav: true,
        element: <PlayList />
    },
    {
        path: "/playlist/detail",
        element: <PlayListDetail />
    },
    {
        path: "/mv",
        icon: 'mvlist',
        name: "MV",
        isNav: true,
        element: <Mv />
    },
    {
        path: "/singer",
        icon: 'singer',
        name: "歌手",
        isNav: true,
        element: <Singer />
    },
    {
        path: "/singer/detail",
        element: <SingerDetail />
    },
    {
        path: "/song",
        element: <SongDetail />
    },
    {
        path: "/user",
        element: <User />
    },
    {
        path: "*",
        icon: 'index',
        name: "404",
        element: <NotFound />
    },
];

export default routeList;