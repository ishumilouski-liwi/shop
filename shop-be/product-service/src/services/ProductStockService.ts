import { ImportedProductInStock, ProductInStock } from "@models/ProductInStock";
import crypto from 'crypto';
import { ProductService } from "./ProductService";
import { StockService } from "./StockService";
import { Product } from "@models/Product";
import { StockItem } from "@models/Stock";
import { ddbDocClient } from "@libs/ddbClient";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { TransactWriteItem, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";

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

  async createProductInStock(product: Product, stockItem: StockItem) {
    const command = new TransactWriteCommand({
      TransactItems: [{
        Put: {
          TableName: ProductService.getTableName(),
          Item: product,
          ConditionExpression: 'attribute_not_exists(PK)'
        }
      }, {
        Put: {
          TableName: StockService.getTableName(),
          Item: stockItem,
          ConditionExpression: 'attribute_not_exists(PK)'
        }
      }]
    })

    return await ddbDocClient.send(command);
  }

  /**
   * Creates multiple products and assigns them in the stock 
   */
  async batchCreateProductInStock(items: ImportedProductInStock[]): Promise<ProductInStock[]> {
    const { products, stockItems } = items.reduce((acc, item) => {
      const productId = crypto.randomUUID();

      acc.products.push({
        id: productId,
        title: item.Title,
        description: item.Description,
        price: Number(item.Price),
      });

      acc.stockItems.push({
        productId,
        count: Number(item.Count),
      });

      return acc;
    }, { products: [], stockItems: [] });


    const command = new TransactWriteItemsCommand({
      TransactItems: [
        ...products.map(product => ProductService.prepareWriteItemSchema(product)),
        ...stockItems.map(stockItem => StockService.prepareWriteItemSchema(stockItem)),
      ]
    });

    await ddbDocClient.send(command);

    return products.map(product => {
      const stockItem = stockItems.find(({ productId }) => productId === product.id);

      return {
        ...product,
        count: stockItem.count,
      }
    });
  }
}
