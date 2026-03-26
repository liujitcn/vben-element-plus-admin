<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';
import type { DashboardCountResponse } from '@/rpc/admin/dashboard';

import { computed, onMounted, reactive } from 'vue';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';

import { defDashboardService } from '@/api/admin/dashboard';
import { DashboardTimeType } from '@/rpc/admin/dashboard';

import GoodsBar from './goods-bar.vue';
import GoodsPie from './goods-pie.vue';
import OrderBar from './order-bar.vue';
import OrderRadar from './order-radar.vue';

defineOptions({
  name: 'DashboardAnalytics',
});

const dashboardCountUser = reactive<DashboardCountResponse>({
  newNum: 0,
  totalNum: 0,
});
const dashboardCountGoods = reactive<DashboardCountResponse>({
  newNum: 0,
  totalNum: 0,
});
const dashboardCountOrder = reactive<DashboardCountResponse>({
  newNum: 0,
  totalNum: 0,
});
const dashboardCountSale = reactive<DashboardCountResponse>({
  newNum: 0,
  totalNum: 0,
});

function formatSale(value: number) {
  return Number((value / 100).toFixed(2));
}

const overviewItems = computed<AnalysisOverviewItem[]>(() => {
  return [
    {
      icon: 'lucide:users',
      iconClass: 'text-sky-500',
      title: '新增用户',
      totalTitle: '总用户数',
      totalValue: dashboardCountUser.totalNum,
      value: dashboardCountUser.newNum,
    },
    {
      icon: 'lucide:package',
      iconClass: 'text-emerald-500',
      title: '新增商品',
      totalTitle: '总商品数',
      totalValue: dashboardCountGoods.totalNum,
      value: dashboardCountGoods.newNum,
    },
    {
      icon: 'lucide:receipt-text',
      iconClass: 'text-violet-500',
      title: '订单量',
      totalTitle: '总订单量',
      totalValue: dashboardCountOrder.totalNum,
      value: dashboardCountOrder.newNum,
    },
    {
      icon: 'lucide:wallet-cards',
      iconClass: 'text-amber-500',
      title: '销售额',
      totalTitle: '总销售额',
      totalValue: formatSale(dashboardCountSale.totalNum),
      value: formatSale(dashboardCountSale.newNum),
    },
  ];
});

const chartTabs = computed<TabOption[]>(() => [
  {
    label: '销售数据统计',
    value: 'order',
  },
  {
    label: '商品销量排行榜',
    value: 'goods',
  },
]);

async function queryCount(
  request: () => Promise<DashboardCountResponse>,
  target: DashboardCountResponse,
) {
  Object.assign(target, await request());
}

async function loadOverview() {
  await Promise.all([
    queryCount(
      () => defDashboardService.DashboardCountUser({ timeType: DashboardTimeType.DAY }),
      dashboardCountUser,
    ),
    queryCount(
      () => defDashboardService.DashboardCountGoods({ timeType: DashboardTimeType.DAY }),
      dashboardCountGoods,
    ),
    queryCount(
      () => defDashboardService.DashboardCountOrder({ timeType: DashboardTimeType.DAY }),
      dashboardCountOrder,
    ),
    queryCount(
      () => defDashboardService.DashboardCountSale({ timeType: DashboardTimeType.DAY }),
      dashboardCountSale,
    ),
  ]);
}

onMounted(() => {
  loadOverview();
});
</script>

<template>
  <div class="p-5">
    <AnalysisOverview v-if="overviewItems.length > 0" :items="overviewItems" />

    <AnalysisChartsTabs v-if="chartTabs.length > 0" :tabs="chartTabs" class="mt-5">
      <template #order>
        <OrderBar />
      </template>
      <template #goods>
        <GoodsBar />
      </template>
    </AnalysisChartsTabs>

    <div class="mt-5 grid gap-5 xl:grid-cols-2">
      <AnalysisChartCard title="商品分类分布">
        <GoodsPie />
      </AnalysisChartCard>
      <AnalysisChartCard title="订单状态雷达图">
        <OrderRadar />
      </AnalysisChartCard>
    </div>
  </div>
</template>
