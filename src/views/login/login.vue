<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw, useTemplateRef, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';
import TextCaptcha from './text-captcha.vue';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationLogin>>('loginRef');
const captchaId = ref('');

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'userName',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(TextCaptcha),
      componentProps: {
        onCaptchaIdChange: (value: string) => {
          captchaId.value = value;
        },
        placeholder: $t('authentication.code'),
      },
      fieldName: 'captchaCode',
      rules: z.string().length(6, { message: $t('authentication.codeTip', [6]) }),
    },
  ];
});

async function handleSubmit(values: Record<string, any>) {
  try {
    await authStore.authLogin({
      ...values,
      captchaId: captchaId.value,
    });
  } catch (error) {
    const formApi = loginRef.value?.getFormApi();
    formApi?.setFieldValue('captchaCode', '', false);
    await formApi
      ?.getFieldComponentRef<{ refreshCaptcha: () => Promise<void> }>('captchaCode')
      ?.refreshCaptcha?.();
    throw error;
  }
}
</script>

<template>
  <AuthenticationLogin
    ref="loginRef"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="handleSubmit"
  />
</template>
