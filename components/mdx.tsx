import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';
import { Chart } from './mdx/chart';

function Video({ src, title, type = 'youtube' }: { src: string; title?: string; type?: 'youtube' | 'direct' }) {
  if (type === 'youtube') {
    const id = src.includes('v=') ? src.split('v=')[1]?.split('&')[0] : src.split('/').pop();
    return (
      <div className="my-6 aspect-video w-full overflow-hidden rounded-xl border bg-muted">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title || "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <video src={src} controls className="my-6 w-full rounded-xl border bg-muted">
      {title}
    </video>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Step,
    Steps,
    Tab,
    Tabs,
    Callout,
    Video,
    Chart,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
