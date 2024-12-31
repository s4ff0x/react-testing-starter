import { db } from "./db.ts";

// const products = [
//   { id: 1, name: "Apple", price: 100, categoryId: 1 },
//   { id: 2, name: "Banana", price: 50, categoryId: 2 },
//   { id: 3, name: "Orange", price: 200, categoryId: 3 },
// ];

export const handlers = [
  // http.get("/categories", () => {
  //   return HttpResponse.json([
  //     { id: 1, name: "Electronics" },
  //     { id: 2, name: "Gardening" },
  //     { id: 3, name: "Games" },
  //   ]);
  // }),
  // http.get("/products/:id", ({ params }) => {
  //   const product = products.find((p) => p.id === Number(params.id));
  //   if (!product) {
  //     return HttpResponse.json(null, { status: 404 });
  //   }
  //   return HttpResponse.json(product);
  // }),
  ...db.product.toHandlers("rest"),
  ...db.category.toHandlers("rest"),
];
