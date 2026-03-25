<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';
import TextCaptcha from './text-captcha.vue';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const captchaCode = ref('');

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
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
        onCaptchaChange: (code: string) => {
          captchaCode.value = code;
        },
        placeholder: $t('authentication.code'),
      },
      fieldName: 'captcha',
      rules: z
        .string()
        .min(1, { message: $t('authentication.codeTip', [4]) })
        .refine(
          (value) => value.toUpperCase() === captchaCode.value.toUpperCase(),
          {
            message: $t('authentication.verifyRequiredTip'),
          },
        ),
    },
  ];
});
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin"
  />
</template>
