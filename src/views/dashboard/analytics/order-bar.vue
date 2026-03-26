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
  const seriesData = sourceData.seriesData;
  const orderCountSeries = seriesData[0]?.value ?? [];
  const saleAmountSeries = (seriesData[1]?.value ?? []).map((item) => item / 100);
  const orderRateSeries = (seriesData[2]?.value ?? []).map((item) => item / 100);
  const saleRateSeries = (seriesData[3]?.value ?? []).map((item) => item / 100);

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
    legend: {
      x: 'center',
      y: 'bottom',
      data: ['销售金额', '订单数量', '销售金额增长率', '订单数量增长率'],
      textStyle: {
        color: '#999',
      },
    },
    xAxis: [
      {
        type: 'category',
        data: sourceData.axisData,
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '销售金额',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          color: '#83bff6',
        },
        axisLabel: {
          formatter: '{value}元',
        },
      },
      {
        type: 'value',
        name: '订单数量',
        position: 'left',
        alignTicks: true,
        offset: 80,
        axisLine: {
          show: true,
          color: '#25d73c',
        },
        axisLabel: {
          formatter: '{value}单',
        },
      },
      {
        type: 'value',
        name: '增长率',
        position: 'right',
        axisLine: {
          show: true,
          color: '#EE6666',
        },
        axisLabel: {
          formatter: '{value}%',
        },
      },
    ],
    series: [
      {
        name: '订单数量',
        type: 'bar',
        yAxisIndex: 1,
        data: orderCountSeries,
        barWidth: 20,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#25d73c' },
            { offset: 0.5, color: '#1bc23d' },
            { offset: 1, color: '#179e61' },
          ]),
        },
      },
      {
        name: '销售金额',
        type: 'bar',
        data: saleAmountSeries,
        barWidth: 20,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
      },
      {
        name: '订单数量增长率',
        type: 'line',
        yAxisIndex: 2,
        data: orderRateSeries,
        itemStyle: {
          color: '#409EFF',
        },
      },
      {
        name: '销售金额增长率',
        type: 'line',
        yAxisIndex: 2,
        data: saleRateSeries,
        itemStyle: {
          color: '#67C23A',
        },
      },
    ],
  };
}

onMounted(async () => {
  const res = await defDashboardService.DashboardBarOrder({
    timeType: DashboardTimeType.DAY,
  });
  Object.assign(sourceData, res);

  await renderEcharts(getChartOption());
});
</script>

<template>
  <EchartsUI ref="chartRef" height="400px" />
</template>
