import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import type { TrpcContext } from "../_core/context";

// Define mocks BEFORE importing the module
const mockCreatePayment = vi.fn();
const mockCreateSubscription = vi.fn();
const mockGetUserPayments = vi.fn();
const mockGetActiveSubscriptions = vi.fn();

vi.mock("../db", () => ({
  createPayment: mockCreatePayment,
  createSubscription: mockCreateSubscription,
  getUserPayments: mockGetUserPayments,
  getActiveSubscriptions: mockGetActiveSubscriptions,
}));

// Mock mockStripe BEFORE importing the router
const mockCheckoutSessionsCreate = vi.fn();
const mockCheckoutSessionsRetrieve = vi.fn();
const mockSubscriptionsCancel = vi.fn();

vi.mock("../_core/mockStripe", () => ({
  mockStripe: {
    checkout: {
      sessions: {
        create: mockCheckoutSessionsCreate,
        retrieve: mockCheckoutSessionsRetrieve,
      },
    },
    subscriptions: {
      cancel: mockSubscriptionsCancel,
    },
  },
}));

// Import AFTER mocking
import { paymentsRouter } from "./payments";

function createMockContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: { origin: "http://localhost:3000" },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("paymentsRouter", () => {
  let caller: ReturnType<typeof paymentsRouter.createCaller>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCheckoutSessionsCreate.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.example.com/session",
      client_reference_id: "1",
      customer_email: "test@example.com",
      amount_total: 55000,
      currency: "ZAR",
      status: "open",
      metadata: { user_id: "1", dog_id: "1", package_id: "1" },
      created: Math.floor(Date.now() / 1000),
    });

    mockCheckoutSessionsRetrieve.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.example.com/session",
      status: "complete",
      amount_total: 55000,
      currency: "ZAR",
    });

    mockCreatePayment.mockResolvedValue({
      id: 1,
      userId: 1,
      amount: "550",
      currency: "ZAR",
      paymentMethod: "card",
      status: "completed",
      stripePaymentIntentId: "cs_test_123",
      notes: "Payment for single package",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockCreateSubscription.mockResolvedValue({
      id: 1,
      userId: 1,
      dogId: 1,
      packageId: 4,
      stripeSubscriptionId: "sub_test_123",
      status: "active",
      billingCycle: "monthly",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sessionsUsed: 0,
      sessionsRemaining: 4,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockGetUserPayments.mockResolvedValue([
      {
        id: 1,
        userId: 1,
        amount: "550",
        currency: "ZAR",
        status: "completed",
        paymentMethod: "card",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    mockGetActiveSubscriptions.mockResolvedValue([
      {
        id: 1,
        userId: 1,
        dogId: 1,
        packageId: 4,
        status: "active",
        billingCycle: "monthly",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sessionsUsed: 0,
        sessionsRemaining: 4,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    mockSubscriptionsCancel.mockResolvedValue({
      id: "sub_test_123",
      status: "canceled",
    });

    const ctx = createMockContext();
    caller = paymentsRouter.createCaller(ctx);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createCheckoutSession", () => {
    it("should create a checkout session for a single booking", async () => {
      const session = await caller.createCheckoutSession({
        packageId: 1,
        packageName: "Single Session",
        amount: 550,
        dogId: 1,
      });

      expect(session).toHaveProperty("sessionId");
      expect(session).toHaveProperty("checkoutUrl");
      expect(session.checkoutUrl).toContain("checkout.example.com");
    });

    it("should create a checkout session for a monthly subscription", async () => {
      const session = await caller.createCheckoutSession({
        packageId: 4,
        packageName: "Monthly Unlimited",
        amount: 1950,
        dogId: 1,
        billingCycle: "monthly",
      });

      expect(session).toHaveProperty("sessionId");
      expect(session).toHaveProperty("checkoutUrl");
    });
  });

  describe("getPaymentHistory", () => {
    it("should return user's payment history", async () => {
      const payments = await caller.getPaymentHistory();
      expect(payments).toHaveLength(1);
      expect(payments[0]).toHaveProperty("status", "completed");
      expect(payments[0]).toHaveProperty("amount", "550");
    });
  });

  describe("getActiveSubscriptions", () => {
    it("should return user's active subscriptions", async () => {
      const subscriptions = await caller.getActiveSubscriptions();
      expect(subscriptions).toHaveLength(1);
      expect(subscriptions[0]).toHaveProperty("status", "active");
      expect(subscriptions[0]).toHaveProperty("billingCycle", "monthly");
    });
  });

  describe("cancelSubscription", () => {
    it("should cancel an active subscription", async () => {
      const result = await caller.cancelSubscription({
        subscriptionId: 1,
      });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("message", "Subscription cancelled");
    });
  });
});
