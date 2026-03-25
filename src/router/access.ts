import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { h, render } from 'vue';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';
import { VbenSpinner } from '@vben-core/shadcn-ui';

import { getAllMenusApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';

const forbiddenComponent = () => import('#/views/error/403.vue');

let loadingContainer: HTMLDivElement | null = null;

function showMenuLoading() {
  if (loadingContainer) {
    return;
  }

  loadingContainer = document.createElement('div');
  loadingContainer.className = 'fixed inset-0 z-[9999]';
  document.body.append(loadingContainer);

  render(h(VbenSpinner, { class: 'fixed inset-0', spinning: true }), loadingContainer);
}

function hideMenuLoading() {
  if (!loadingContainer) {
    return;
  }

  render(null, loadingContainer);
  loadingContainer.remove();
  loadingContainer = null;
}

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      showMenuLoading();
      try {
        return await getAllMenusApi();
      } finally {
        hideMenuLoading();
      }
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
