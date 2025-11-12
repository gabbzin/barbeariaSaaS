"use server";

import { actionClient } from "@/lib/actionClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { returnValidationErrors } from "next-safe-action";
import { headers } from "next/headers";
import { z } from "zod";

const inputSchema = z.object({
  bookingId: z.string().uuid(),
});

export const cancelBooking = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { bookingId } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Booking not found"],
      });
    }

    if (booking.userId !== session!.user.id) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        cancelled: true,
        cancelledAt: new Date(),
      },
    });

    return { success: true };
  });
