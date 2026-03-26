<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw, useTemplateRef, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';

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
        placeholder: "请输入用户名",
      },
      fieldName: 'userName',
      label: "账号",
      rules: z.string().min(1, { message: "请输入用户名" }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: "密码",
      },
      fieldName: 'password',
      label: "密码",
      rules: z.string().min(1, { message: "请输入密码" }),
    },
    {
      component: markRaw(TextCaptcha),
      componentProps: {
        onCaptchaIdChange: (value: string) => {
          captchaId.value = value;
        },
        placeholder: "验证码",
      },
      fieldName: 'captchaCode',
      rules: z.string().length(6, { message: `请输入${6}位验证码` }),
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
