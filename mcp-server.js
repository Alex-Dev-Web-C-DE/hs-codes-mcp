import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "hs-codes-mcp",
  version: "1.0.0"
});

server.tool(
  "classify_product",
  { description: z.string().describe("Product description to classify") },
  async ({ description }) => {
    const res = await fetch("https://hs-codes-classifier.boring-saas-infra.workers.dev/dev-classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description })
    });
    const data = await res.json();
    return { content: [{ type: "text", text: JSON.stringify(data) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
