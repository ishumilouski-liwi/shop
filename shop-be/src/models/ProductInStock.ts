import { Product } from "./Product";
import { StockItem } from "./Stock";

export interface ProductInStock extends Product {
  count: StockItem["count"];
}
