"use server";

import { actionClient } from "@/lib/actionClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { returnValidationErrors } from "next-safe-action";
import { headers } from "next/headers";
import Stripe from "stripe";
import z from "zod";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
});

export const createBookingCheckoutSession = actionClient
  .inputSchema(inputSchema)
  .outputSchema(
    z.object({
      url: z.string().nullable(),
    }),
  )
  .action(async ({ parsedInput: { serviceId, date } }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not configured.");
    }

    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      returnValidationErrors(inputSchema, {
        _errors: ["Não autorizado."],
      });
    }

    const service = await prisma.barbershopService.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        barbershop: true,
      },
    });

    if (!service) {
      returnValidationErrors(inputSchema, {
        _errors: ["Serviço não encontrado."],
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-07-30.basil",
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      metadata: {
        serviceId: serviceId,
        barbershopId: service.barbershopId,
        userId: session.user.id,
        date: date.toISOString(),
      },
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: service.priceInCents,
            product_data: {
              name: `${service.barbershop.name} - ${service.name} em ${format(date, "dd/MM/yyyy HH:mm")}`,
              description: `${service.description}`,
              images: [service.imageUrl],
            },
          },
          quantity: 1,
        },
      ],
    });
    return { url: checkoutSession.url };
  });
