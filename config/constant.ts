// .env variables
export const NEXTLEG_URL = process.env.NEXT_PUBLIC_NEXTLEG_URL
export const NEXTLEG_TOKEN = process.env.NEXT_PUBLIC_NEXTLEG_TOKEN
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const PUSHER_APPID = process.env.NEXT_PUBLIC_PUSHER_APPID || ""
export const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY || ""
export const PUSHER_SECRET = process.env.NEXT_PUBLIC_PUSHER_SECRET || ""
export const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || ""
export const PUSHER_CHANNEL = process.env.NEXT_PUBLIC_PUSHER_CHANNEL || ""
export const PUSHER_EVENT = process.env.NEXT_PUBLIC_PUSHER_EVENT || ""
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// constant variable
export const AUTH_TOKEN_NAME = "edenai_auth_token"
export const EMPTY_TOKEN = ""