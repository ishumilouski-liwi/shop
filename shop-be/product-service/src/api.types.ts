import { Product } from "@models/Product";
import { StockItem } from "@models/Stock";

export type PutUpsertProductInStockBody = Product & Pick<StockItem, 'count'>;