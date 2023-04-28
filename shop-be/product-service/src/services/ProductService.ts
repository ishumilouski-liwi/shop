import { PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@libs/ddbClient";
import { Product } from "@models/Product";

export class ProductService {
  public static getTableName() {
    return process.env.DB_PRODUCTS_TABLE_NAME;
  }
  /**
   * Queries all products
   */
  async getProducts(): Promise<Product[]> {
    const { Items: products } = await ddbDocClient.send(
      new ScanCommand({
        TableName: ProductService.getTableName(),
      })
    );

    return products as Product[];
  }

  /**
   * Queries a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    const command = new QueryCommand({
      TableName: ProductService.getTableName(),
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    });

    const { Items } = await ddbDocClient.send(command);

    const product = Items[0];

    if (!product) {
      throw new Error(`Product with id "${id}" not found`);
    }

    return product as Product;
  }

  async addProduct(product: Product) {
    const response = await ddbDocClient.send(
      new PutCommand({
        TableName: ProductService.getTableName(),
        Item: product,
      })
    );

    return response;
  }
}
