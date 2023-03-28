import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: [
    "web/index.ts",
    "web/core.ts",
    "web/createEffect.ts",
    "web/createSignal.ts",
    "web/context.ts",
  ],
  outdir: "public/dist",
});
