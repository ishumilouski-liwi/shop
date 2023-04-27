import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@libs/ddbClient";
import { StockItem } from "@models/Stock";

export class StockService {
  /**
   * Queries all products details in the stock
   */
  async getItems(): Promise<StockItem[]> {
    const command = new ScanCommand({
      TableName: process.env.DB_STOCK_TABLE_NAME,
    });

    const response = await ddbDocClient.send(command);

    return response.Items as StockItem[];
  }

  /**
   * Adds a new product in the stock
   */
  async addItem(productId: string, count: number) {
    const response = await ddbDocClient.send(
      new PutCommand({
        TableName: process.env.DB_STOCK_TABLE_NAME,
        Item: {
          productId,
          count,
        },
      })
    );

    return response;
  }

  /**
   * Get a stock item by a product id
   */
  async getByProductId(productId: string): Promise<StockItem> {
    const stockItems = await this.getItems();

    const stockItem = stockItems.find((item) => item.productId === productId);

    if (!stockItem) {
      throw new Error(`Product with id "${productId}" not found in the stock`);
    }

    return stockItem;
  }
}
