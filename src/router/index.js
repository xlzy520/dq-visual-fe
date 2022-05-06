import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' },
      },
    ],
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: '111',
        name: '111',
        component: () => import('@/views/111'),
        meta: { title: '111', icon: 'table' },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' },
      },
    ],
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' },
      },
    ],
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'order',
        name: '订单列表',
        component: () => import('@/views/order/order'),
        meta: { title: '订单列表', icon: 'table' },
      },
    ],
  },
  {
    path: '/customer',
    component: Layout,
    children: [
      {
        path: 'customer',
        name: '客户列表',
        component: () => import('@/views/customer/customer'),
        meta: { title: '客户列表', icon: 'table' },
      },
    ],
  },
  {
    path: '/motorType',
    component: Layout,
    children: [
      {
        path: 'motorType',
        name: '电机种类',
        component: () => import('@/views/motorType/motorType'),
        meta: { title: '电机种类', icon: 'table' },
      },
    ],
  },
  {
    path: '/addCustomer',
    component: Layout,
    children: [
      {
        path: 'addCustomer',
        name: '添加企业信息',
        component: () => import('@/views/addInformation/addCustomer'),
        meta: { title: '添加企业信息', icon: 'table' },
      },
    ],
  },
  {
    path: '/addMotorType',
    component: Layout,
    children: [
      {
        path: 'addMotorType',
        name: '添加电机种类',
        component: () => import('@/views/addInformation/addMotorType'),
        meta: { title: '添加电机种类', icon: 'table' },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
