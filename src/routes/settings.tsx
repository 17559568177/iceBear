import path from 'path';
import { lazy, ReactNode } from 'react';
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

interface ExtendIndexRouteObject extends IndexRouteObject {
    name?: string;
    indexPath?: string;
    icon?: ReactNode;
    activeIcon?: ReactNode;
    key?: string;
    children?: undefined;
}

interface ExtendNonIndexRouteObject extends NonIndexRouteObject {
    name?: string;
    indexPath?: string;
    icon?: ReactNode;
    activeIcon?: ReactNode;
    key?: string;
    children?: basicRoutes[];
}

export type basicRoutes = ExtendIndexRouteObject | ExtendNonIndexRouteObject;

const DashBoard = lazy(() => import('@/pages/index'));
const Repository = lazy(() => import('@/pages/RepositoryPage'));
const Violation = lazy(() => import('@/pages/ViolationPage'));
const Assistant = lazy(() => import('@/pages/AssistantPage'));
const Writing = lazy(() => import('@/pages/WritingPage'));
const Login = lazy(() => import('@/pages/Login'));
const Permissions = lazy(() => import('@/pages/PermissionsPage'));
const Myagent = lazy(() => import('@/pages/MyagentPage/index'))
const AgentIndexPage = lazy(() => import('@/pages/MyagentPage/AgentIndexPage'))
const AgentApplicationCenter = lazy(() => import('@/pages/MyagentPage/AgentApplicationCenter'))
const AgentChatpage = lazy(() => import('@/pages/MyagentPage/AgentChatpage'))
const Agentcollection = lazy(() => import('@/pages/MyagentPage/Agentcollection'))
const Workflow = lazy(() => import('@/pages/MyagentPage/workflow'))
// const Op = lazy(() => import('@/pages/MyagentPage/op'))
// const Workflow = lazy(() => import('@/pages/Workflow'))


const RouteTable: basicRoutes[] = [
    {
        path: '/',
        element: <DashBoard />,
        name: 'DashBoard',
        children: [
            {
                path: '/permissions',
                element: <Permissions />,
                name: 'Permissions'
            },
            {
                path: '/assistant',
                element: <Assistant />,
                name: 'Assistant'
            },
            {
                path: '/violation',
                element: <Violation />,
                name: 'Violation'
            },
            {
                path: '/repository',
                element: <Repository />,
                name: 'Repository',
                children: [
                    {
                        path: '/repository/:id',
                        element: <Repository />,
                        name: 'RepositoryDetail'
                    }
                ]
            },
            {
                path: 'writing',
                element: <Writing />,
                name: 'Writing'
            },
            {
                path: '/myagent',
                element: <Myagent />,
                name: 'Myagent',
                children: [
                    {
                        path: '/myagent',
                        element: <AgentIndexPage />
                    },
                    {
                        path: 'agentIndexPage',
                        element: <AgentIndexPage />,
                        name: 'agentIndexPage',
                    },
                    {
                        path: 'AgentApplicationCenter',
                        element: <AgentApplicationCenter />,
                        name: 'AgentApplicationCenter'
                    },
                    {
                        path: 'AgentChatpage/:id',
                        element: <AgentChatpage />,
                        name: 'AgentChatpage'
                    },
                    {
                        path: 'Agentcollection',
                        element: <Agentcollection />,
                        name: 'Agentcollection'
                    },
                    {
                        path: 'Workflow',
                        element: <Workflow />,
                        name: 'Workflow'
                    }
                ]

            },
            // {
            //     path: 'workflow',
            //     element: <Workflow />
            // }
        ]
    },
    {
        path: '/login',
        element: <Login />,
        name: 'Login'
    },

];

export default RouteTable;
