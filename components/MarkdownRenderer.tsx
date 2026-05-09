"use client";

import { useEffect, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState<string>("");
  const [mermaidCode, setMermaidCode] = useState<string[]>([]);

  useEffect(() => {
    async function processMarkdown() {
      try {
        // Extract mermaid code blocks first
        const mermaidBlocks: string[] = [];
        
        const result = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(() => {
            return (tree: any) => {
              visit(tree, "code", (node: any) => {
                if (node.lang === "mermaid") {
                  mermaidBlocks.push(node.value);
                  node.type = "html";
                  node.value = `<div class="mermaid-placeholder" data-mermaid="${mermaidBlocks.length - 1}"></div>`;
                }
              });
            };
          })
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeHighlight)
          .use(rehypeStringify, { allowDangerousHtml: true })
          .process(content);

        setMermaidCode(mermaidBlocks);
        setHtml(String(result.value));
      } catch (error) {
        console.error("Error processing markdown:", error);
        setHtml(`<p>Error rendering content</p>`);
      }
    }

    processMarkdown();
  }, [content]);

  useEffect(() => {
    // Render Mermaid diagrams after HTML is set
    if (mermaidCode.length > 0 && typeof window !== "undefined") {
      import("mermaid").then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
        });

        mermaidCode.forEach((code, index) => {
          const placeholder = document.querySelector(`[data-mermaid="${index}"]`);
          if (placeholder) {
            const container = document.createElement("div");
            container.className = "mermaid";
            container.textContent = code;
            placeholder.replaceWith(container);
          }
        });

        mermaid.run();
      });
    }
  }, [mermaidCode, html]);

  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
