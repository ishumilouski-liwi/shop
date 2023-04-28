export default {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    count: { type: "number" },
  },
  required: ["title", "description", "price", "count"],
} as const;
