import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, dogs, InsertDog, Dog, bookings, InsertBooking, Booking, subscriptions, InsertSubscription, Subscription, packages, Package, payments, InsertPayment, Payment } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Dog management
export async function createDog(userId: number, dog: Omit<InsertDog, 'userId'>): Promise<Dog> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(dogs).values({ ...dog, userId });
  const created = await db.select().from(dogs).where(eq(dogs.id, result[0].insertId)).limit(1);
  return created[0];
}

export async function getUserDogs(userId: number): Promise<Dog[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(dogs).where(eq(dogs.userId, userId));
}

// Booking management
export async function createBooking(booking: InsertBooking): Promise<Booking> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(bookings).values(booking);
  const created = await db.select().from(bookings).where(eq(bookings.id, result[0].insertId)).limit(1);
  return created[0];
}

export async function getUserBookings(userId: number): Promise<Booking[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(bookings).where(eq(bookings.userId, userId));
}

// Subscription management
export async function createSubscription(subscription: InsertSubscription): Promise<Subscription> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values(subscription);
  const created = await db.select().from(subscriptions).where(eq(subscriptions.id, result[0].insertId)).limit(1);
  return created[0];
}

export async function getUserSubscriptions(userId: number): Promise<Subscription[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
}

export async function getActiveSubscriptions(userId: number): Promise<Subscription[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(subscriptions).where(
    and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, 'active')
    )
  );
}

// Payment management
export async function createPayment(payment: InsertPayment): Promise<Payment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(payments).values(payment);
  const created = await db.select().from(payments).where(eq(payments.id, result[0].insertId)).limit(1);
  return created[0];
}

export async function getUserPayments(userId: number): Promise<Payment[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(payments).where(eq(payments.userId, userId));
}

// Package management
export async function getAllPackages(): Promise<Package[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(packages);
}

export async function getPackageById(id: number): Promise<Package | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
  return result[0];
}
