// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"referensi.mdx": () => import("../content/docs/referensi.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "platform-ugc.mdx": () => import("../content/docs/platform-ugc.mdx?collection=docs"), "tools-setup.mdx": () => import("../content/docs/tools-setup.mdx?collection=docs"), "best-practices.mdx": () => import("../content/docs/best-practices.mdx?collection=docs"), "platform-comparison.mdx": () => import("../content/docs/platform-comparison.mdx?collection=docs"), "latar-belakang.mdx": () => import("../content/docs/latar-belakang.mdx?collection=docs"), "platform-video.mdx": () => import("../content/docs/platform-video.mdx?collection=docs"), "workflow-comfyui.mdx": () => import("../content/docs/workflow-comfyui.mdx?collection=docs"), "workflow-branded.mdx": () => import("../content/docs/workflow-branded.mdx?collection=docs"), "platform-image.mdx": () => import("../content/docs/platform-image.mdx?collection=docs"), "workflow-ugc.mdx": () => import("../content/docs/workflow-ugc.mdx?collection=docs"), }),
};
export default browserCollections;