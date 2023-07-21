"use client"
import Pricing from '@/components/Pricing';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import { useAuth } from '@/app/auth-provider';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Session, ProductWithPrices, SubscriptionWithProduct } from "@/config/type";

export default function PricingPage() {
  // const { session } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [products, setProducts] = useState<ProductWithPrices[]>([])
  const [subscription, setSubscription] = useState<SubscriptionWithProduct | null>(null)
  useEffect(() => {
    async function getPricing() {
      try {
        const [session, products, subscription] = await Promise.all([
          getSession(),
          getActiveProductsWithPrices(),
          getSubscription()
        ]);
        setSession(session)
        setProducts(products)
        setSubscription(subscription)
        console.log(session)
        if (!session) {
          return redirect('/signin')
        }
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
