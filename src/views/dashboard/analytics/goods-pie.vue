<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';
import type { DashboardPieResponse } from '@/rpc/admin/dashboard';

import { onMounted, reactive, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { defDashboardService } from '@/api/admin/dashboard';
import { DashboardTimeType } from '@/rpc/admin/dashboard';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const sourceData = reactive<DashboardPieResponse>({
  seriesData: [],
});

function getChartOption() {
  return {
    legend: {
      bottom: '2%',
      left: 'center',
    },
    series: [
      {
        animationDelay() {
          return Math.random() * 100;
        },
        animationEasing: 'exponentialInOut',
        animationType: 'scale',
        avoidLabelOverlap: false,
        color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9', '#91cc75', '#fac858'],
        data: sourceData.seriesData,
        emphasis: {
          label: {
            fontSize: 12,
            fontWeight: 'bold',
            show: true,
          },
        },
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2,
        },
        label: {
          position: 'center',
          show: false,
        },
        labelLine: {
          show: false,
        },
        name: '商品分类',
        radius: ['40%', '65%'],
        type: 'pie',
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  };
}

onMounted(async () => {
  const res = await defDashboardService.DashboardPieGoods({
    timeType: DashboardTimeType.DAY,
  });
  Object.assign(sourceData, res);

  await renderEcharts(getChartOption());
});
</script>

<template>
  <EchartsUI ref="chartRef" height="400px" />
</template>
