<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';
import type { DashboardRadarResponse } from '@/rpc/admin/dashboard';

import { onMounted, reactive, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { defDashboardService } from '@/api/admin/dashboard';
import { DashboardTimeType } from '@/rpc/admin/dashboard';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const sourceData = reactive<DashboardRadarResponse>({
  legendData: [],
  radarIndicator: [],
  seriesData: [],
});

function getChartOption() {
  return {
    grid: {
      left: '2%',
      right: '2%',
      bottom: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      x: 'center',
      y: 'bottom',
      data: sourceData.legendData,
      textStyle: {
        color: '#999',
      },
    },
    radar: {
      radius: '60%',
      indicator: sourceData.radarIndicator,
    },
    series: [
      {
        name: '分类销量对比',
        type: 'radar',
        itemStyle: {
          borderRadius: 6,
        },
        data: sourceData.seriesData,
      },
    ],
  };
}

onMounted(async () => {
  const res = await defDashboardService.DashboardRadarOrder({
    timeType: DashboardTimeType.DAY,
  });
  Object.assign(sourceData, res);

  await renderEcharts(getChartOption());
});
</script>

<template>
  <EchartsUI ref="chartRef" height="400px" />
</template>
