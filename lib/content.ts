import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ContentMetadata {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: number;
  status: "Not Started" | "In Progress" | "Completed";
}

export interface ContentFile extends ContentMetadata {
  content: string;
  contentHtml?: string;
}

const contentDirectory = path.join(process.cwd(), "content");

export function getContentSlugs(category?: string): string[] {
  const targetDir = category
    ? path.join(contentDirectory, category)
    : contentDirectory;

  if (!fs.existsSync(targetDir)) {
    return [];
  }

  const slugs: string[] = [];

  function walkDir(dir: string, baseSlug: string = "") {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const newBaseSlug = baseSlug ? `${baseSlug}/${file}` : file;
        walkDir(fullPath, newBaseSlug);
      } else if (file === "index.md" && baseSlug) {
        slugs.push(baseSlug);
      }
    }
  }

  walkDir(targetDir);
  return slugs;
}

export function getContentBySlug(slug: string): ContentFile | null {
  const fullPath = path.join(contentDirectory, `${slug}/index.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    category: data.category || "general",
    tags: data.tags || [],
    level: data.level || "Beginner",
    estimatedTime: data.estimatedTime || 30,
    status: data.status || "Not Started",
    content,
  };
}

export function getAllContent(): ContentFile[] {
  const slugs = getContentSlugs();
  return slugs
    .map((slug) => getContentBySlug(slug))
    .filter((item): item is ContentFile => item !== null);
}

export function getContentByCategory(category: string): ContentFile[] {
  const slugs = getContentSlugs(category);
  return slugs
    .map((slug) => getContentBySlug(`${category}/${slug}`))
    .filter((item): item is ContentFile => item !== null);
}

export function searchContent(query: string): ContentFile[] {
  const allContent = getAllContent();
  const lowercaseQuery = query.toLowerCase();

  return allContent.filter(
    (item) =>
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      item.content.toLowerCase().includes(lowercaseQuery)
  );
}

export function filterContent({
  status,
  level,
  tags,
}: {
  status?: string;
  level?: string;
  tags?: string[];
}): ContentFile[] {
  let filtered = getAllContent();

  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }

  if (level) {
    filtered = filtered.filter((item) => item.level === level);
  }

  if (tags && tags.length > 0) {
    filtered = filtered.filter((item) =>
      tags.some((tag) => item.tags.includes(tag))
    );
  }

  return filtered;
}
