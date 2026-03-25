import type { PluginOption } from 'vite';

import getPort from 'get-port';
import { build, createDevServer, createNitro, prepare } from 'nitropack';

interface NitroMockPluginOptions {
  port?: number;
  rootDir: string;
}

export function viteNitroMockPlugin({
  port = 5320,
  rootDir,
}: NitroMockPluginOptions): PluginOption {
  let started = false;

  return {
    enforce: 'pre',
    name: 'vite:nitro-mock',
    async configureServer(server) {
      if (started) {
        return;
      }

      const availablePort = await getPort({ port });
      if (availablePort !== port) {
        console.warn(
          `[vite:nitro-mock] Port ${port} is unavailable. Skipping mock server.`,
        );
        return;
      }

      started = true;

      const nitro = await createNitro({
        dev: true,
        preset: 'nitro-dev',
        rootDir,
      });

      const devServer = createDevServer(nitro);
      await devServer.listen(port, { showURL: false });
      await prepare(nitro);
      await build(nitro);

      server.httpServer?.once('close', async () => {
        await nitro.close();
      });

      const printUrls = server.printUrls;
      server.printUrls = () => {
        printUrls();
        console.log(`  Nitro Mock Server: http://localhost:${port}/api`);
      };
    },
  };
}
