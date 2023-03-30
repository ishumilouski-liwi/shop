import { Product } from "@models/Product";

export class ProductService {
  async getProducts(): Promise<Product[]> {
    const products = require("./products.json") as Product[];

    return products;
  }

  async getProduct(id: string): Promise<Product> {
    return (await this.getProducts()).find((item) => item.id === id);
  }
}
