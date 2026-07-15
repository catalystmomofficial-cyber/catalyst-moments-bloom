import { defineTool } from "@lovable.dev/mcp-js";

const TAGS = [
  { tag: "pregnancy", description: "Prenatal fitness, symptoms, birth prep." },
  { tag: "postpartum", description: "Recovery, healing, core restoration, newborn life." },
  { tag: "ttc", description: "Trying to conceive: fertility, cycle, nutrition." },
  { tag: "wellness", description: "Mental health, stress, self-care, sleep." },
  { tag: "nutrition", description: "Meals, recipes, nutrients for each stage." },
  { tag: "fitness", description: "Workouts and movement for moms." },
];

export default defineTool({
  name: "list_blog_tags",
  title: "List blog tags",
  description: "List the category tags available for Catalyst Mom blog posts. Use these with search_blog_posts.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(TAGS, null, 2) }],
    structuredContent: { tags: TAGS },
  }),
});
