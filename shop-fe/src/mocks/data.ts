import { OrderStatus } from "~/constants/order";
import { CartItem } from "~/models/CartItem";
import { Order } from "~/models/Order";
import { AvailableProduct, Product } from "~/models/Product";

export const products: Product[] = [
  {
    description:
      "The ESP LTD F-10 Electric Guitar is an ideal metal entry point for beginners. It boasts a simple layout, versatile tones, and comfortable playing experience. Crafted from basswood, the F-10 is light and allows you to reach the upper frets easily thanks to a contoured neck heel. Showing off that ESP flair, the F-10 is cut into a fearsome angular shape that'll give you some serious metal credentials. A searing hot starting point.",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    price: 219,
    title: "ESP LTD F-10",
  },
  {
    description:
      "Welcome to Tone Town. The ESP E-II Eclipse DB is here to show you exactly how a professional standard, 21st Century guitar sounds and feels. Its smooth finish and sleek design will take your breath away, but its sound will take you to a new world.",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    price: 1.999,
    title: "ESP E-II Eclipse DB",
  },
  {
    description:
      "A tonal leviathan. Feast your eyes on the ESP LTD Sparrowhawk Bill Kelliher. ",
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    price: 23,
    title: "ESP LTD Sparrowhawk Bill Kelliher",
  },
];

export const availableProducts: AvailableProduct[] = products.map(
  (product, index) => ({ ...product, count: index + 1 })
);

export const cart: CartItem[] = [
  {
    product: {
      description: "Short Product Description1",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
      price: 24,
      title: "ProductOne",
    },
    count: 2,
  },
  {
    product: {
      description: "Short Product Description7",
      id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
      price: 15,
      title: "ProductName",
    },
    count: 5,
  },
];

export const orders: Order[] = [
  {
    id: "1",
    address: {
      address: "some address",
      firstName: "Name",
      lastName: "Surname",
      comment: "",
    },
    items: [
      { productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa", count: 2 },
      { productId: "7567ec4b-b10c-45c5-9345-fc73c48a80a1", count: 5 },
    ],
    statusHistory: [
      { status: OrderStatus.Open, timestamp: Date.now(), comment: "New order" },
    ],
  },
  {
    id: "2",
    address: {
      address: "another address",
      firstName: "John",
      lastName: "Doe",
      comment: "Ship fast!",
    },
    items: [{ productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa", count: 3 }],
    statusHistory: [
      {
        status: OrderStatus.Sent,
        timestamp: Date.now(),
        comment: "Fancy order",
      },
    ],
  },
];
