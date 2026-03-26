import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { ElNotification } from 'element-plus';
import { defineStore } from 'pinia';

import { getUserInfoApi, loginApi, logoutApi } from '#/api';
import { generateAccess } from '#/router/access';
import { accessRoutes } from '#/router/routes';

type AppUserInfo = UserInfo & {
  permissions?: string[];
};

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);
  const logoutLoading = ref(false);

  function buildLoginLocation(redirect: boolean = true) {
    const currentFullPath = router.currentRoute.value.fullPath;
    const query = redirect
      ? currentFullPath === LOGIN_PATH
        ? ''
        : `?redirect=${encodeURIComponent(currentFullPath)}`
      : '';
    return `${LOGIN_PATH}${query}`;
  }

  function forceRedirectToLogin(redirect: boolean = true) {
    window.location.replace(buildLoginLocation(redirect));
  }

  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    let userInfo: AppUserInfo | null = null;
    try {
      loginLoading.value = true;
      const { accessToken, refreshToken } = await loginApi(params);

      if (accessToken) {
        accessStore.setAccessToken(accessToken);
        accessStore.setRefreshToken(refreshToken ?? null);

        userInfo = await fetchUserInfo();

        userStore.setUserInfo(userInfo);
        accessStore.setAccessCodes(userInfo.permissions ?? []);
        accessStore.setIsAccessChecked(false);

        const userRoles = userInfo.roles ?? [];
        const { accessibleMenus, accessibleRoutes } = await generateAccess({
          roles: userRoles,
          router,
          routes: accessRoutes,
        });

        accessStore.setAccessMenus(accessibleMenus);
        accessStore.setAccessRoutes(accessibleRoutes);
        accessStore.setIsAccessChecked(true);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          const targetPath =
            userInfo.homePath || preferences.app.defaultHomePath;
          onSuccess
            ? await onSuccess?.()
            : await router.push(targetPath);
        }

        if (userInfo.realName) {
          ElNotification({
            message: `${"欢迎回来"}:${userInfo.realName}`,
            title: "登录成功",
            type: 'success',
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true, skipRemote: boolean = false) {
    if (logoutLoading.value) {
      return;
    }

    logoutLoading.value = true;

    try {
      if (!skipRemote) {
        try {
          await logoutApi();
        } catch {
          // ignore logout errors
        }
      }

      resetAllStores();
      accessStore.setLoginExpired(false);

      const loginLocation = buildLoginLocation(redirect);

      try {
        await router.replace(loginLocation);
      } catch {
        forceRedirectToLogin(redirect);
        return;
      }

      if (window.location.pathname !== LOGIN_PATH) {
        forceRedirectToLogin(redirect);
      }
    } finally {
      logoutLoading.value = false;
    }
  }

  async function fetchUserInfo() {
    const userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
    logoutLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
