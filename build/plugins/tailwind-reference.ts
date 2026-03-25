import type { Plugin } from 'vite';

const REFERENCE_LINE = '@reference "@vben/tailwind-config/theme";\n';

export function viteTailwindReferencePlugin(): Plugin {
  return {
    enforce: 'pre',
    name: 'vite:tailwind-reference',
    transform(code, id) {
      if (!id.includes('.vue') || !id.includes('type=style')) {
        return null;
      }

      if (code.includes('@reference') || !code.includes('@apply')) {
        return null;
      }

      return {
        code: REFERENCE_LINE + code,
        map: null,
      };
    },
  };
}
