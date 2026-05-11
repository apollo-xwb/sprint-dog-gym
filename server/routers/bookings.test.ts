import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import type { TrpcContext } from "../_core/context";

// Define mocks BEFORE importing the module
const mockGetUserDogs = vi.fn();
const mockCreateDog = vi.fn();
const mockCreateBooking = vi.fn();
const mockCreatePayment = vi.fn();
const mockGetAllPackages = vi.fn();

vi.mock("../db", () => ({
  getAllPackages: mockGetAllPackages,
  getUserDogs: mockGetUserDogs,
  createDog: mockCreateDog,
  createBooking: mockCreateBooking,
  createPayment: mockCreatePayment,
}));

// Import AFTER mocking
import { bookingsRouter } from "./bookings";

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
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("bookingsRouter", () => {
  let caller: ReturnType<typeof bookingsRouter.createCaller>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockGetAllPackages.mockResolvedValue([
      { id: 1, name: "Single Session", type: "single", price: "550", sessions: 1, validDays: null, description: "Perfect for trying SPRINT" },
      { id: 2, name: "5-Session Bundle", type: "five_session", price: "2500", sessions: 5, validDays: 30, description: "Weekly sessions for a month" },
      { id: 3, name: "10-Session Bundle", type: "ten_session", price: "4800", sessions: 10, validDays: 60, description: "Bi-weekly sessions for 5 months" },
      { id: 4, name: "Monthly Unlimited", type: "monthly", price: "1950", sessions: null, validDays: 30, description: "All sessions for one month" },
    ]);

    mockGetUserDogs.mockResolvedValue([
      { id: 1, userId: 1, name: "Max", breed: "Belgian Malinois", size: "large", age: 3, weight: 35, energyLevel: "very_high", behavioralIssues: null, notes: null, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, userId: 1, name: "Luna", breed: "German Shepherd", size: "large", age: 2, weight: 32, energyLevel: "high", behavioralIssues: null, notes: null, createdAt: new Date(), updatedAt: new Date() },
    ]);

    mockCreateDog.mockResolvedValue({
      id: 3,
      userId: 1,
      name: "Rocky",
      breed: "Labrador Retriever",
      size: "large",
      age: 4,
      weight: 38,
      energyLevel: "high",
      behavioralIssues: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockCreateBooking.mockResolvedValue({
      id: 1,
      userId: 1,
      dogId: 1,
      packageId: 1,
      sessionDate: new Date(),
      status: "scheduled",
      notes: null,
      sessionMetrics: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockCreatePayment.mockResolvedValue({
      id: 1,
      userId: 1,
      bookingId: 1,
      subscriptionId: null,
      amount: "550",
      currency: "ZAR",
      status: "pending",
      stripePaymentIntentId: null,
      paymentMethod: "card",
      receiptUrl: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ctx = createMockContext();
    caller = bookingsRouter.createCaller(ctx);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getPackages", () => {
    it("should return all available packages", async () => {
      const packages = await caller.getPackages();
      expect(packages).toHaveLength(4);
      expect(packages[0]).toHaveProperty("name", "Single Session");
      expect(packages[0]).toHaveProperty("price", "550");
    });
  });

  describe("getDogs", () => {
    it("should return user's dogs", async () => {
      const dogs = await caller.getDogs();
      expect(dogs).toHaveLength(2);
      expect(dogs[0]).toHaveProperty("name", "Max");
      expect(dogs[1]).toHaveProperty("name", "Luna");
    });
  });

  describe("createDog", () => {
    it("should create a new dog profile", async () => {
      const newDog = await caller.createDog({
        name: "Rocky",
        breed: "Labrador Retriever",
        size: "large",
        age: 4,
        weight: 38,
        energyLevel: "high",
      });

      expect(newDog).toHaveProperty("id", 3);
      expect(newDog).toHaveProperty("name", "Rocky");
      expect(newDog).toHaveProperty("breed", "Labrador Retriever");
    });
  });

  describe("createBooking", () => {
    it("should create a booking for a user's dog", async () => {
      const booking = await caller.createBooking({
        dogId: 1,
        packageId: 1,
        sessionDate: new Date(),
        notes: "First session",
      });

      expect(booking).toHaveProperty("id", 1);
      expect(booking).toHaveProperty("status", "scheduled");
      expect(booking).toHaveProperty("dogId", 1);
      expect(booking).toHaveProperty("packageId", 1);
    });
  });

  describe("createPayment", () => {
    it("should create a payment for a booking", async () => {
      const payment = await caller.createPayment({
        bookingId: 1,
        amount: 550,
        paymentMethod: "card",
      });

      expect(payment).toHaveProperty("id", 1);
      expect(payment).toHaveProperty("status", "pending");
      expect(payment).toHaveProperty("amount", "550");
    });
  });
});
