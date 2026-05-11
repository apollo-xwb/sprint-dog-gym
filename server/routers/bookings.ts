import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createDog, getUserDogs, createBooking, getUserBookings, getAllPackages, createPayment } from "../db";
import { TRPCError } from "@trpc/server";

export const bookingsRouter = router({
  // Get all packages
  getPackages: protectedProcedure.query(async () => {
    const packages = await getAllPackages();
    return packages;
  }),

  // Get user's dogs
  getDogs: protectedProcedure.query(async ({ ctx }) => {
    return await getUserDogs(ctx.user.id);
  }),

  // Create a new dog profile
  createDog: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        breed: z.string().min(1),
        size: z.enum(["small", "medium", "large", "xlarge"]),
        age: z.number().optional(),
        weight: z.number().optional(),
        energyLevel: z.enum(["low", "medium", "high", "very_high"]),
        behavioralIssues: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createDog(ctx.user.id, input);
    }),

  // Get user's bookings
  getBookings: protectedProcedure.query(async ({ ctx }) => {
    return await getUserBookings(ctx.user.id);
  }),

  // Create a booking
  createBooking: protectedProcedure
    .input(
      z.object({
        dogId: z.number(),
        packageId: z.number(),
        sessionDate: z.date(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify dog belongs to user
      const dogs = await getUserDogs(ctx.user.id);
      if (!dogs.find((d) => d.id === input.dogId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Dog not found",
        });
      }

      return await createBooking({
        userId: ctx.user.id,
        dogId: input.dogId,
        packageId: input.packageId,
        sessionDate: input.sessionDate,
        notes: input.notes,
        status: "scheduled",
      });
    }),

  // Create a payment (for single sessions or package purchases)
  createPayment: protectedProcedure
    .input(
      z.object({
        bookingId: z.number().optional(),
        subscriptionId: z.number().optional(),
        amount: z.number(),
        paymentMethod: z.enum(["card", "bank_transfer", "eft"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.bookingId && !input.subscriptionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either bookingId or subscriptionId is required",
        });
      }

      return await createPayment({
        userId: ctx.user.id,
        bookingId: input.bookingId,
        subscriptionId: input.subscriptionId,
        amount: input.amount.toString(),
        currency: "ZAR",
        paymentMethod: input.paymentMethod,
        status: "pending",
      });
    }),
});
