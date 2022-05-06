import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

import MapChart from '@/views/dashboard/charts/MapChart';
import WordCloudChart from '@/views/dashboard/charts/WordCloudChart';
import TradeAmountCount from '@/views/dashboard/charts/TradeAmountCount';
import MainTradeCount from '@/views/dashboard/charts/MainTradeCount';
import SaleDetail from '@/views/dashboard/charts/SaleDetail';
import EconomicBenefits from '@/views/dashboard/charts/EconomicBenefits';
import Funnel from '@/views/dashboard/charts/Funnel';

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
    redirect: '/chart1',
    meta: { title: '图表模块', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'chart1',
        name: '中国各省份用电量的分布',
        component: MapChart,
        meta: { title: '中国各省份用电量的分布', icon: 'dashboard' },
      },
      {
        path: 'chart2',
        name: '电气设备热点搜索',
        component: WordCloudChart,
        meta: { title: '电气设备热点搜索', icon: 'dashboard' },
      },
      {
        path: 'chart3',
        name: '不同类型电机出进口额的统计',
        component: TradeAmountCount,
        meta: { title: '不同类型电机出进口额的统计', icon: 'dashboard' },
      },
      {
        path: 'chart4',
        name: '我国电机出口主要贸易统计',
        component: MainTradeCount,
        meta: { title: '我国电机出口主要贸易统计', icon: 'dashboard' },
      },
      {
        path: 'chart5',
        name: '电机企业近5年销售情况图',
        component: SaleDetail,
        meta: { title: '电机企业近5年销售情况图', icon: 'dashboard' },
      },
      {
        path: 'chart6',
        name: '电机企业的经济效益图',
        component: EconomicBenefits,
        meta: { title: '电机企业的经济效益图', icon: 'dashboard' },
      },
      {
        path: 'chart7',
        name: '用户购买电机转化率统计',
        component: Funnel,
        meta: { title: '用户购买电机转化率统计', icon: 'dashboard' },
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
        path: 'table1',
        name: '订单列表',
        component: () => import('@/views/table/index'),
        meta: { title: '订单列表', icon: 'table' },
      },
      {
        path: 'table2',
        name: '客户列表',
        component: () => import('@/views/table/index2'),
        meta: { title: '客户列表', icon: 'table' },
      },
      {
        path: 'table3',
        name: '电机总类',
        component: () => import('@/views/table/index3'),
        meta: { title: '电机总类', icon: 'table' },
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
