import { useRoutes } from 'react-router-dom';
import RouteTable, { basicRoutes } from '@/routes/settings';
import { TypePermissions, useAuthStore } from '@/store/auth';

// 检查页面级权限
const filterRoutes = (routes: basicRoutes[], permissions: TypePermissions) => {
    return routes.filter(route => {
        if (route.name && permissions.pages.includes(route.name)) {
            return true;
        }

        if (route.name && !permissions.pages.includes(route.name)) {
            // 如果有子路由，递归过滤
            if (route.children) {
                route.children = filterRoutes(route.children, permissions);
            } else {
                return false;
            }
        }

        return true;
    });
};

const AppWithMenu = () => {
    const permissions = useAuthStore.getState().permissions;

    return useRoutes(filterRoutes(RouteTable, permissions));
};

export default AppWithMenu;
