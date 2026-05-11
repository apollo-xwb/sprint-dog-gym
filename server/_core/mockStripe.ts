/**
 * Mock Stripe Implementation
 * For development and testing purposes
 */

export interface MockCheckoutSession {
  id: string;
  url: string;
  client_reference_id: string;
  customer_email: string;
  amount_total: number;
  currency: string;
  status: 'open' | 'complete' | 'expired';
  metadata: Record<string, string>;
  created: number;
}

export interface MockPaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'canceled';
  client_secret: string;
  metadata: Record<string, string>;
  created: number;
}

export interface MockSubscription {
  id: string;
  customer: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  current_period_start: number;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        id: string;
        amount: number;
        currency: string;
        recurring: {
          interval: 'month' | 'year';
          interval_count: number;
        };
      };
    }>;
  };
  metadata: Record<string, string>;
  created: number;
}

const sessions = new Map<string, MockCheckoutSession>();
const subscriptions = new Map<string, MockSubscription>();
const paymentIntents = new Map<string, MockPaymentIntent>();

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export const mockStripe = {
  checkout: {
    sessions: {
      create: async (params: {
        payment_method_types: string[];
        line_items: Array<{ price_data: { currency: string; product_data: { name: string }; unit_amount: number }; quantity: number }>;
        mode: 'payment' | 'subscription';
        success_url: string;
        cancel_url: string;
        customer_email?: string;
        client_reference_id?: string;
        metadata?: Record<string, string>;
        allow_promotion_codes?: boolean;
      }): Promise<MockCheckoutSession> => {
        const totalAmount = params.line_items.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0);
        
        const session: MockCheckoutSession = {
          id: generateId('cs'),
          url: `${params.success_url}?session_id=${generateId('session')}`,
          client_reference_id: params.client_reference_id || '',
          customer_email: params.customer_email || '',
          amount_total: totalAmount,
          currency: params.line_items[0]?.price_data.currency || 'ZAR',
          status: 'open',
          metadata: params.metadata || {},
          created: Math.floor(Date.now() / 1000),
        };

        sessions.set(session.id, session);
        return session;
      },

      retrieve: async (sessionId: string): Promise<MockCheckoutSession | null> => {
        return sessions.get(sessionId) || null;
      },
    },
  },

  paymentIntents: {
    create: async (params: {
      amount: number;
      currency: string;
      payment_method_types: string[];
      metadata?: Record<string, string>;
      customer_email?: string;
    }): Promise<MockPaymentIntent> => {
      const intent: MockPaymentIntent = {
        id: generateId('pi'),
        amount: params.amount,
        currency: params.currency,
        status: 'succeeded',
        client_secret: generateId('secret'),
        metadata: params.metadata || {},
        created: Math.floor(Date.now() / 1000),
      };

      paymentIntents.set(intent.id, intent);
      return intent;
    },

    retrieve: async (intentId: string): Promise<MockPaymentIntent | null> => {
      return paymentIntents.get(intentId) || null;
    },
  },

  subscriptions: {
    create: async (params: {
      customer: string;
      items: Array<{ price: string; quantity?: number }>;
      metadata?: Record<string, string>;
      billing_cycle_anchor?: number;
    }): Promise<MockSubscription> => {
      const subscription: MockSubscription = {
        id: generateId('sub'),
        customer: params.customer,
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
        items: {
          data: params.items.map((item) => ({
            price: {
              id: item.price,
              amount: 195000, // R1,950 in cents (mock)
              currency: 'ZAR',
              recurring: {
                interval: 'month',
                interval_count: 1,
              },
            },
          })),
        },
        metadata: params.metadata || {},
        created: Math.floor(Date.now() / 1000),
      };

      subscriptions.set(subscription.id, subscription);
      return subscription;
    },

    retrieve: async (subscriptionId: string): Promise<MockSubscription | null> => {
      return subscriptions.get(subscriptionId) || null;
    },

    update: async (subscriptionId: string, params: { metadata?: Record<string, string>; billing_cycle_anchor?: number }): Promise<MockSubscription | null> => {
      const sub = subscriptions.get(subscriptionId);
      if (!sub) return null;

      if (params.metadata) {
        sub.metadata = { ...sub.metadata, ...params.metadata };
      }

      subscriptions.set(subscriptionId, sub);
      return sub;
    },

    cancel: async (subscriptionId: string): Promise<MockSubscription | null> => {
      const sub = subscriptions.get(subscriptionId);
      if (!sub) return null;

      sub.status = 'canceled';
      subscriptions.set(subscriptionId, sub);
      return sub;
    },
  },

  webhooks: {
    constructEvent: async (body: string, sig: string, secret: string) => {
      // Mock webhook verification - always succeeds in development
      try {
        return JSON.parse(body);
      } catch {
        throw new Error('Invalid webhook body');
      }
    },
  },
};
