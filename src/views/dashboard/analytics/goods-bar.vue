<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';
import type { DashboardBarResponse } from '@/rpc/admin/dashboard';

import { onMounted, reactive, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { defDashboardService } from '@/api/admin/dashboard';
import { DashboardTimeType } from '@/rpc/admin/dashboard';

import * as echarts from 'echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const sourceData = reactive<DashboardBarResponse>({
  axisData: [],
  seriesData: [],
});

function getChartOption() {
  const goodsSeries = sourceData.seriesData[0]?.value ?? [];

  return {
    grid: {
      left: '2%',
      right: '2%',
      bottom: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    xAxis: [
      {
        type: 'value',
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: sourceData.axisData,
      },
    ],
    series: [
      {
        name: '销售数量',
        type: 'bar',
        data: goodsSeries,
        barWidth: 20,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
      },
    ],
  };
}

onMounted(async () => {
  const res = await defDashboardService.DashboardBarGoods({
    timeType: DashboardTimeType.DAY,
    top: 15,
  });
  Object.assign(sourceData, res);

  await renderEcharts(getChartOption());
});
</script>

<template>
  <EchartsUI ref="chartRef" height="400px" />
</template>
