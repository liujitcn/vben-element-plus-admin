<script setup lang="ts">

import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceInterfaceControl',
});

const widgetGlobalSearch = defineModel<boolean>('widgetGlobalSearch');
const widgetFullscreen = defineModel<boolean>('widgetFullscreen');
const widgetThemeToggle = defineModel<boolean>('widgetThemeToggle');
const widgetSidebarToggle = defineModel<boolean>('widgetSidebarToggle');
const widgetLockScreen = defineModel<boolean>('widgetLockScreen');
const widgetRefresh = defineModel<boolean>('widgetRefresh');
</script>

<template>
  <SwitchItem v-model="widgetGlobalSearch">
    {{ "启用全局搜索" }}
  </SwitchItem>
  <SwitchItem v-model="widgetThemeToggle">
    {{ "启用主题切换" }}
  </SwitchItem>
  <SwitchItem v-model="widgetFullscreen">
    {{ "启用全屏" }}
  </SwitchItem>
  <SwitchItem v-model="widgetLockScreen">
    {{ "启用锁屏" }}
  </SwitchItem>
  <SwitchItem v-model="widgetSidebarToggle">
    {{ "启用侧边栏切换" }}
  </SwitchItem>
  <SwitchItem v-model="widgetRefresh">
    {{ "启用刷新" }}
  </SwitchItem>
</template>
