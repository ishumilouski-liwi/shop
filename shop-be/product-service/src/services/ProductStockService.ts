import { ProductInStock } from "@models/ProductInStock";
import { ProductService } from "./ProductService";
import { StockService } from "./StockService";

export class ProductStockService {
  private productService = new ProductService();
  private stockService = new StockService();

  /**
   * Get product by id and attaches its count in the stock
   */
  async getProduct(id: string): Promise<ProductInStock> {
    const [product, stockItem] = await Promise.all([
      this.productService.getProduct(id),
      this.stockService.getByProductId(id),
    ]);

    return {
      ...product,
      count: stockItem.count,
    };
  }

  /**
   * Queries all products and theirs count from the stock
   */
  async getProducts(): Promise<ProductInStock[]> {
    const [stockItems, products] = await Promise.all([
      this.stockService.getItems(),
      this.productService.getProducts(),
    ]);

    return products.map((product) => {
      const itemInStock = stockItems.find(
        (stockItem) => stockItem.productId === product.id
      );

      return {
        ...product,
        count: itemInStock ? itemInStock.count : 0,
      };
    });
  }
}
