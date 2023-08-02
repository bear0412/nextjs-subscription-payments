"use client"
import Pricing from '@/components/Pricing';
import {
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import { useAuth } from '@/app/auth-provider';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Session, ProductWithPrices, SubscriptionWithProduct } from "@/config/type";

export default function PricingPage() {
  const { session } = useAuth()

  if (!session) {
    return redirect('/signin');
  }

  const [products, setProducts] = useState<ProductWithPrices[]>([])
  const [subscription, setSubscription] = useState<SubscriptionWithProduct | null>(null)
  useEffect(() => {
    async function getPricing() {
      try {
        const [products, subscription] = await Promise.all([
          getActiveProductsWithPrices(),
          getSubscription()
        ]);
        setProducts(products)
        setSubscription(subscription)
      } catch (error) {
        console.log(error)
      }
    }

    getPricing()
  }, [])

  return (
    <Pricing
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
    />
  );
}
