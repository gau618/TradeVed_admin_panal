// types/subscription.ts
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  start_date: string;
  end_date: string;
  status: string;
  user?: { email: string; name: string }; // If included from backend
  plan?: { name: string };
}
