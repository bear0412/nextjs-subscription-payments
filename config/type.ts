import { Dispatch, SetStateAction } from "react";
import { Database } from "@/types_db";
import { Session as SessionType } from "@supabase/gotrue-js/src/lib/types"

export declare type SetValue<T> = Dispatch<SetStateAction<T>>;

export declare type NextlegResponse = {
  imageUrl: any;
  imageUrls: string[],
  originatingMessageId: string,
  content: string,
}
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Price = Database['public']['Tables']['prices']['Row'];
export type Gallery = Database['public']['Tables']['gallery']['Row'];
export type Users = Database['public']['Tables']['users']['Row'];
export type Session = SessionType;

export interface ProductWithPrices extends Product {
  prices: Price[];
}
export interface PriceWithProduct extends Price {
  products: Product | null;
}
export interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}
