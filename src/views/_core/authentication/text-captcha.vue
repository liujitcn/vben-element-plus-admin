<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { RotateCw } from '@vben/icons';

const modelValue = defineModel<string>({ default: '' });

interface Props {
  onCaptchaChange?: (code: string) => void;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  onCaptchaChange: undefined,
  placeholder: '请输入验证码',
});

const captchaCode = ref('');

function generateCaptcha(length: number = 4) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  return Array.from({ length }, () => {
    return chars[Math.floor(Math.random() * chars.length)];
  }).join('');
}

function refreshCaptcha() {
  captchaCode.value = generateCaptcha();
  modelValue.value = '';
  props.onCaptchaChange?.(captchaCode.value);
}

const captchaSvg = computed(() => {
  const chars = captchaCode.value
    .split('')
    .map((char, index) => {
      const x = 16 + index * 18;
      const y = 24 + (index % 2 === 0 ? 0 : 4);
      const rotate = index % 2 === 0 ? -8 : 8;
      return `<text x="${x}" y="${y}" fill="#0f766e" font-size="18" font-family="monospace" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
    })
    .join('');

  const lines = Array.from({ length: 4 }, (_, index) => {
    const y1 = 10 + index * 8;
    const y2 = 18 + index * 7;
    return `<line x1="8" y1="${y1}" x2="92" y2="${y2}" stroke="rgba(15,118,110,0.25)" stroke-width="1" />`;
  }).join('');

  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="36" viewBox="0 0 100 36">
      <rect width="100" height="36" rx="8" fill="#f8fafc" />
      ${lines}
      ${chars}
    </svg>`,
  )}`;
});

onMounted(() => {
  refreshCaptcha();
});
</script>

<template>
  <div class="flex items-center gap-3">
    <input
      v-model="modelValue"
      :placeholder="placeholder"
      autocomplete="off"
      class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      maxlength="4"
      type="text"
    />
    <button
      :aria-label="placeholder"
      class="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-2 text-xs text-foreground transition hover:bg-accent"
      type="button"
      @click="refreshCaptcha"
    >
      <img :alt="placeholder" :src="captchaSvg" class="h-8 w-[100px] rounded" />
      <RotateCw class="size-3.5 shrink-0" />
    </button>
  </div>
</template>
