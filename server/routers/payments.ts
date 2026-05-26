import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createPayment, createSubscription, getUserPayments, getActiveSubscriptions } from "../db";
import { mockStripe } from "../_core/mockStripe";
import { TRPCError } from "@trpc/server";

export const paymentsRouter = router({
  // Create a checkout session for a single booking or package
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        packageId: z.number(),
        packageName: z.string(),
        amount: z.number(), // in ZAR
        dogId: z.number(),
        billingCycle: z.enum(["single", "monthly", "yearly"]).optional(),
        location: z.string().optional(),
        sessions: z.array(z.object({ date: z.string(), time: z.string() })).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const origin = ctx.req.headers.origin || "http://localhost:3000";

      const session = await mockStripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "ZAR",
              product_data: {
                name: input.packageName,
              },
              unit_amount: Math.round(input.amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: input.billingCycle && input.billingCycle !== "single" ? "subscription" : "payment",
        success_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/booking-cancelled`,
        customer_email: ctx.user.email || "",
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          dog_id: input.dogId.toString(),
          package_id: input.packageId.toString(),
          billing_cycle: input.billingCycle || "single",
        },
        allow_promotion_codes: true,
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url,
      };
    }),

  // Confirm payment and create booking/subscription
  confirmPayment: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        packageId: z.number(),
        dogId: z.number(),
        billingCycle: z.enum(["single", "monthly", "yearly"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = await mockStripe.checkout.sessions.retrieve(input.sessionId);

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Checkout session not found",
        });
      }

      if (session.status !== "complete") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Checkout session is not complete",
        });
      }

      // Create payment record
      const payment = await createPayment({
        userId: ctx.user.id,
        amount: (session.amount_total / 100).toString(),
        currency: "ZAR",
        paymentMethod: "card",
        status: "completed",
        stripePaymentIntentId: session.id,
        notes: `Payment for ${input.billingCycle || "single"} package`,
      });

      // If subscription, create subscription record
      if (input.billingCycle && input.billingCycle !== "single") {
        const startDate = new Date();
        let endDate = new Date();

        if (input.billingCycle === "monthly") {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (input.billingCycle === "yearly") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const subscription = await createSubscription({
          userId: ctx.user.id,
          dogId: input.dogId,
          packageId: input.packageId,
          stripeSubscriptionId: session.id,
          status: "active",
          billingCycle: input.billingCycle as "monthly" | "yearly",
          startDate,
          endDate,
          sessionsUsed: 0,
          sessionsRemaining: input.billingCycle === "monthly" ? 4 : 48, // Mock: 4 per month, 48 per year
          nextBillingDate: endDate,
          autoRenew: true,
        });

        return {
          success: true,
          type: "subscription",
          subscriptionId: subscription.id,
          paymentId: payment.id,
        };
      }

      return {
        success: true,
        type: "single",
        paymentId: payment.id,
      };
    }),

  // Get user's payment history
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    return await getUserPayments(ctx.user.id);
  }),

  // Get user's active subscriptions
  getActiveSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    return await getActiveSubscriptions(ctx.user.id);
  }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const subscriptions = await getActiveSubscriptions(ctx.user.id);
      const subscription = subscriptions.find((s) => s.id === input.subscriptionId);

      if (!subscription) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      // Mock cancellation
      const cancelled = await mockStripe.subscriptions.cancel(subscription.stripeSubscriptionId || "");

      return {
        success: true,
        message: "Subscription cancelled",
      };
    }),
});
