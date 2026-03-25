import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import ElementPlus from 'unplugin-element-plus/vite';
import { defineConfig, loadEnv } from 'vite';
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import';

import { viteTailwindReferencePlugin } from './build/plugins/tailwind-reference';

const resolvePath = (value: string) =>
  fileURLToPath(new URL(value, import.meta.url));

const normalizeFilePath = (value: string) => value.replaceAll('\\', '/');

const globalScssPath = normalizeFilePath(
  resolvePath('./packages/styles/src/global/index.scss'),
);

function shouldInjectGlobalScss(filepath: string) {
  const normalized = normalizeFilePath(filepath);
  return !(
    normalized.endsWith('/packages/styles/src/global/index.scss') ||
    normalized.includes('/packages/@core/base/design/src/scss-bem/')
  );
}

export default defineConfig(({mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT || 5777);

  return {
    base: env.VITE_BASE || '/',
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (content: string, filepath: string) =>
            shouldInjectGlobalScss(filepath)
              ? `@use "${globalScssPath}" as *;\n${content}`
              : content,
        },
      },
    },
    plugins: [
      vue({
        script: {
          defineModel: true,
        },
      }),
      viteTailwindReferencePlugin(),
      tailwindcss(),
      lazyImport({
        resolvers: [
          VxeResolver({
            libraryName: 'vxe-table',
          }),
          VxeResolver({
            libraryName: 'vxe-pc-ui',
          }),
        ],
      }),
      ElementPlus({
        format: 'esm',
      }),
    ].filter(Boolean),
    resolve: {
      alias: [
        {
          find: /^@\//,
          replacement: `${resolvePath('./src')}/`,
        },
        {
          find: /^#\//,
          replacement: `${resolvePath('./src')}/`,
        },
        {
          find: '@vben/types/global',
          replacement: resolvePath('./packages/types/global.d.ts'),
        },
        {
          find: '@vben-core/design/bem',
          replacement: resolvePath(
            './packages/@core/base/design/src/scss-bem/bem.scss',
          ),
        },
        {
          find: '@vben/tailwind-config/theme',
          replacement: resolvePath('./internal/tailwind-config/src/theme.css'),
        },
        {
          find: '@vben/styles/ele',
          replacement: resolvePath('./packages/styles/src/ele/index.css'),
        },
        {
          find: '@vben/styles/global',
          replacement: resolvePath('./packages/styles/src/global/index.scss'),
        },
        {
          find: '@vben/common-ui/es',
          replacement: resolvePath('./packages/effects/common-ui/src/components'),
        },
        {
          find: '@vben-core/shared',
          replacement: resolvePath('./packages/@core/base/shared/src'),
        },
        {
          find: '@vben-core/composables',
          replacement: resolvePath('./packages/@core/composables/src'),
        },
        {
          find: '@vben-core/design',
          replacement: resolvePath('./packages/@core/base/design/src'),
        },
        {
          find: '@vben-core/form-ui',
          replacement: resolvePath('./packages/@core/ui-kit/form-ui/src'),
        },
        {
          find: '@vben-core/icons',
          replacement: resolvePath('./packages/@core/base/icons/src'),
        },
        {
          find: '@vben-core/layout-ui',
          replacement: resolvePath('./packages/@core/ui-kit/layout-ui/src'),
        },
        {
          find: '@vben-core/menu-ui',
          replacement: resolvePath('./packages/@core/ui-kit/menu-ui/src'),
        },
        {
          find: '@vben-core/popup-ui',
          replacement: resolvePath('./packages/@core/ui-kit/popup-ui/src'),
        },
        {
          find: '@vben-core/preferences',
          replacement: resolvePath('./packages/@core/preferences/src'),
        },
        {
          find: '@vben-core/shadcn-ui',
          replacement: resolvePath('./packages/@core/ui-kit/shadcn-ui/src'),
        },
        {
          find: '@vben-core/tabs-ui',
          replacement: resolvePath('./packages/@core/ui-kit/tabs-ui/src'),
        },
        {
          find: '@vben-core/typings',
          replacement: resolvePath('./packages/@core/base/typings/src'),
        },
        {
          find: '@vben/access',
          replacement: resolvePath('./packages/effects/access/src'),
        },
        {
          find: '@vben/common-ui',
          replacement: resolvePath('./packages/effects/common-ui/src'),
        },
        {
          find: '@vben/constants',
          replacement: resolvePath('./packages/constants/src'),
        },
        {
          find: '@vben/hooks',
          replacement: resolvePath('./packages/effects/hooks/src'),
        },
        {
          find: '@vben/icons',
          replacement: resolvePath('./packages/icons/src'),
        },
        {
          find: '@vben/layouts',
          replacement: resolvePath('./packages/effects/layouts/src'),
        },
        {
          find: '@vben/locales',
          replacement: resolvePath('./packages/locales/src'),
        },
        {
          find: '@vben/plugins',
          replacement: resolvePath('./packages/effects/plugins/src'),
        },
        {
          find: '@vben/preferences',
          replacement: resolvePath('./packages/preferences/src'),
        },
        {
          find: '@vben/request',
          replacement: resolvePath('./packages/effects/request/src'),
        },
        {
          find: '@vben/stores',
          replacement: resolvePath('./packages/stores/src'),
        },
        {
          find: '@vben/styles',
          replacement: resolvePath('./packages/styles/src'),
        },
        {
          find: '@vben/types',
          replacement: resolvePath('./packages/types/src'),
        },
        {
          find: '@vben/utils',
          replacement: resolvePath('./packages/utils/src'),
        },
      ],
    },
    server: {
      host: true,
      port,
      proxy: {
        '/api': {
          changeOrigin: true,
          target: 'http://localhost:7001',
          ws: true,
        },
        '/shop': {
          changeOrigin: true,
          target: 'http://localhost:7001',
          ws: true,
        },
      },
    },
  };
});
