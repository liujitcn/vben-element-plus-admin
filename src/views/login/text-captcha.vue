<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { RotateCw } from '@vben/icons';
import { Input } from '@vben-core/shadcn-ui';

import { defLoginService } from '#/api/base/login';

const modelValue = defineModel<string>({ default: '' });

interface Props {
  onCaptchaIdChange?: (captchaId: string) => void;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  onCaptchaIdChange: undefined,
  placeholder: '请输入验证码',
});

const captchaImage = ref('');
const loading = ref(false);

function normalizeCaptchaImage(value: string) {
  if (!value) {
    return '';
  }
  if (value.startsWith('data:image')) {
    return value;
  }
  return `data:image/png;base64,${value}`;
}

async function refreshCaptcha() {
  loading.value = true;
  try {
    const response = await defLoginService.Captcha({});
    captchaImage.value = normalizeCaptchaImage(response.captchaBase64);
    modelValue.value = '';
    props.onCaptchaIdChange?.(response.captchaId);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void refreshCaptcha();
});

defineExpose({
  refreshCaptcha,
});
</script>

<template>
  <div class="flex w-full items-center gap-3">
    <Input
      v-model="modelValue"
      :placeholder="placeholder"
      autocomplete="off"
      class="flex-1"
      maxlength="6"
      type="text"
    />
    <button
      :aria-label="placeholder"
      :disabled="loading"
      class="flex h-10 shrink-0 items-center gap-2 rounded-md border border-input bg-background px-3 text-xs text-foreground shadow-xs transition hover:bg-accent disabled:cursor-wait disabled:opacity-70"
      type="button"
      @click="refreshCaptcha"
    >
      <img :alt="placeholder" :src="captchaImage" class="h-8 w-[100px] rounded bg-muted" />
      <RotateCw class="size-3.5 shrink-0" />
    </button>
  </div>
</template>
