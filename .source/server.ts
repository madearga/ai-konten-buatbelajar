// @ts-nocheck
import * as __fd_glob_12 from "../content/docs/workflow-ugc.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/platform-image.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/workflow-branded.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/workflow-comfyui.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/platform-video.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/latar-belakang.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/platform-comparison.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/best-practices.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/tools-setup.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/platform-ugc.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/referensi.mdx?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, }, {"referensi.mdx": __fd_glob_1, "index.mdx": __fd_glob_2, "platform-ugc.mdx": __fd_glob_3, "tools-setup.mdx": __fd_glob_4, "best-practices.mdx": __fd_glob_5, "platform-comparison.mdx": __fd_glob_6, "latar-belakang.mdx": __fd_glob_7, "platform-video.mdx": __fd_glob_8, "workflow-comfyui.mdx": __fd_glob_9, "workflow-branded.mdx": __fd_glob_10, "platform-image.mdx": __fd_glob_11, "workflow-ugc.mdx": __fd_glob_12, });