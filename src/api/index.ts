import type { Recordable, UserInfo } from '@vben/types';
import type { RouteMeta, RouteRecordStringComponent } from '@vben-core/typings';

import { preferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { defAuthService } from './admin/auth';
import { defLoginService } from './base/login';

type AppUserInfo = UserInfo & {
  deptName?: string;
  permissions: string[];
  roleName?: string;
};

function parseRouteParam(value?: string) {
  if (value === undefined || value === null) {
    return value;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeComponent(component?: string, hasChildren: boolean = false) {
  const value = component?.trim();
  if (!value) {
    return hasChildren ? 'BasicLayout' : '';
  }

  if (['BasicLayout', 'Layout'].includes(value)) {
    return 'BasicLayout';
  }

  if (['IFrameView'].includes(value)) {
    return 'IFrameView';
  }

  if (value === 'error/401') {
    return 'error/403';
  }

  if (value === 'app/index') {
    return 'error/coming-soon';
  }

  return value;
}

function normalizeAssetUrl(value?: string) {
  const raw = value?.trim();
  if (!raw) {
    return '';
  }

  if (
    raw.startsWith('data:') ||
    raw.startsWith('blob:') ||
    /^(https?:)?\/\//.test(raw)
  ) {
    return raw;
  }

  const apiBase = import.meta.env.VITE_GLOB_API_URL || '/api';

  if (apiBase.startsWith('http')) {
    const { origin } = new URL(apiBase);
    const pathname = raw.startsWith('/') ? raw : `/${raw}`;
    return new URL(pathname, origin).toString();
  }

  if (raw.startsWith('/shop/')) {
    return raw;
  }

  if (raw.startsWith('/api/')) {
    return raw;
  }

  const pathname = raw.startsWith('/') ? raw : `/${raw}`;
  return `${apiBase}${pathname}`;
}

function normalizeRouteMeta(meta?: {
  alwaysShow?: boolean;
  hidden?: boolean;
  icon?: string;
  keepAlive?: boolean;
  params?: Array<{ key?: string; value?: string }>;
  title?: string;
}) {
  const params = Object.fromEntries(
    (meta?.params ?? [])
      .filter((item) => item.key)
      .map((item) => [item.key as string, parseRouteParam(item.value)]),
  ) as Partial<RouteMeta>;

  return {
    ...params,
    hideChildrenInMenu:
      params.hideChildrenInMenu ?? (meta?.alwaysShow === false ? false : undefined),
    hideInMenu: params.hideInMenu ?? meta?.hidden,
    icon: params.icon ?? meta?.icon,
    keepAlive: params.keepAlive ?? meta?.keepAlive,
    title: String(params.title ?? meta?.title ?? ''),
  } satisfies Partial<RouteMeta>;
}

function sanitizeRouteName(value: string) {
  return value
    .replace(/[:*]/g, '_')
    .replace(/[^\w/-]+/g, '_')
    .replace(/\//g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function buildRouteName(
  route: any,
  meta: Partial<RouteMeta>,
  parentKey: string,
  index: number,
) {
  if (route.name) {
    return String(route.name);
  }

  const seed = [
    parentKey,
    route.path,
    route.component,
    meta.title,
    String(index),
  ]
    .filter(Boolean)
    .join('_');

  return sanitizeRouteName(seed) || `route_${index}`;
}

function normalizeRoute(
  route: any,
  parentKey: string = 'root',
  index: number = 0,
): RouteRecordStringComponent {
  const meta = normalizeRouteMeta(route.meta);
  const routeName = buildRouteName(route, meta, parentKey, index);
  const children = (route.children ?? []).map((item: any, childIndex: number) =>
    normalizeRoute(item, routeName, childIndex),
  );
  const hasChildren = children.length > 0;
  const normalizedComponent = normalizeComponent(route.component, hasChildren);

  return {
    children,
    component: normalizedComponent,
    meta,
    name: routeName,
    path: route.path,
    redirect: route.redirect,
  } as RouteRecordStringComponent;
}

function mapUserInfo(data: {
  avatar: string;
  deptName: string;
  nickName: string;
  phone: string;
  permission: string[];
  roleCode: string;
  roleName: string;
  userName: string;
}): AppUserInfo {
  const accessStore = useAccessStore();
  return {
    avatar: normalizeAssetUrl(data.avatar) || preferences.app.defaultAvatar,
    deptName: data.deptName || '',
    desc: data.phone || data.userName || '',
    homePath: '/dashboard/workspace',
    permissions: data.permission ?? [],
    realName: data.nickName || data.userName,
    roles: data.roleCode ? [data.roleCode] : [],
    roleName: data.roleName || '',
    token: accessStore.accessToken ?? '',
    userId: data.userName,
    username: data.userName,
  };
}

export async function loginApi(params: Recordable<any>) {
  const response = await defLoginService.Login({
    captchaCode: params.captchaCode ?? params.captcha ?? '',
    captchaId: params.captchaId ?? '',
    password: params.password ?? '',
    userName: params.userName ?? params.username ?? '',
  });

  useAccessStore().setRefreshToken(response.refreshToken ?? null);
  return response;
}

export async function logoutApi() {
  return await defLoginService.Logout({});
}

export async function getUserInfoApi(): Promise<AppUserInfo> {
  const response = await defAuthService.GetUserInfo({});
  return mapUserInfo(response);
}

export async function getAccessCodesApi() {
  const response = await defAuthService.GetUserInfo({});
  return response.permission ?? [];
}

export async function getAllMenusApi(): Promise<RouteRecordStringComponent[]> {
  const response = await defAuthService.GetUserMenu({});
  return (response.list ?? []).map((item, index) =>
    normalizeRoute(item, 'root', index),
  );
}
