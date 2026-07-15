import { defineMcp } from "@lovable.dev/mcp-js";
import searchBlogPosts from "./tools/search-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import listBlogTags from "./tools/list-blog-tags";

export default defineMcp({
  name: "catalyst-mom-mcp",
  title: "Catalyst Mom",
  version: "0.1.0",
  instructions:
    "Public tools for Catalyst Mom — a maternal wellness platform covering TTC, pregnancy, and postpartum. Use `list_blog_tags` to see categories, `search_blog_posts` to find articles by keyword and tag, and `get_blog_post` to read the full content of a specific post. This server exposes only published blog content; user data is not available.",
  tools: [searchBlogPosts, getBlogPost, listBlogTags],
});
