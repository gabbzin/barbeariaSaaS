"use server";

import { actionClient } from "@/lib/actionClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { endOfDay, format, startOfDay } from "date-fns";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";

const inputSchema = z.object({
  barbershopId: z.uuid(),
  date: z.date(),
});

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barbershopId, date } }) => {
    // lógica para buscar horários disponíveis para o serviço na data fornecida
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        barbershopId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        cancelled: false,
      },
    });

    const occupiedSlots = bookings.map((b) => format(b.date, "HH:mm"));

    const availableSlots = TIME_SLOTS.filter(
      (slot) => !occupiedSlots.includes(slot),
    );

    return availableSlots;
  });
