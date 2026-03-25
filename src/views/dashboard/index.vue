<script setup lang="ts">
import { computed } from 'vue';

import { useUserStore } from '@vben/stores';

defineOptions({ name: 'DashboardIndex' });

const userStore = useUserStore();

const welcomeText = computed(() => {
  const realName = userStore.userInfo?.realName || userStore.userInfo?.username || '用户';
  return `欢迎回来，${realName}`;
});
</script>

<template>
  <section class="grid gap-6">
    <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
      <h1 class="mt-3 text-3xl font-semibold text-foreground">{{ welcomeText }}</h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        当前项目已经切到真实登录和动态菜单链路。后续业务页面可以按后端菜单逐步补齐。
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 class="text-sm font-medium text-foreground">登录状态</h2>
        <p class="mt-2 text-sm text-muted-foreground">已接入真实验证码、登录、刷新令牌逻辑。</p>
      </div>
      <div class="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 class="text-sm font-medium text-foreground">动态菜单</h2>
        <p class="mt-2 text-sm text-muted-foreground">菜单数据直接使用后端返回结果进行组装。</p>
      </div>
      <div class="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 class="text-sm font-medium text-foreground">页面迁移</h2>
        <p class="mt-2 text-sm text-muted-foreground">login、profile、error 已迁出 `_core` 目录。</p>
      </div>
    </div>
  </section>
</template>
