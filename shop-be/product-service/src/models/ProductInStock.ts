import { Product } from "./Product";
import { StockItem } from "./Stock";

export interface ProductInStock extends Product {
  count: StockItem["count"];
}


export interface ImportedProductInStock {
  Title: string;
  Description: string;
  Price: string;
  Count: string;
}