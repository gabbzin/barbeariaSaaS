"use server";

import { actionClient } from "@/lib/actionClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { returnValidationErrors } from "next-safe-action";
import { headers } from "next/headers";
import { z } from "zod";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
});

export const createBooking = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { serviceId, date } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    // Validação: não permitir agendamentos no passado
    if (date < new Date()) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Não é possível agendar em uma data passada."],
      });
    }

    const service = await prisma.barbershopService.findUnique({
      where: {
        id: serviceId,
      },
    });
    if (!service) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Service not found"],
      });
    }
    // verificar se já existe agendamento para essa data
    const existingBooking = await prisma.booking.findFirst({
      where: {
        barbershopId: service.barbershopId,
        date,
        cancelled: false,
      },
    });
    if (existingBooking) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Já existe um agendamento para essa data."],
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session!.user.id,
        barbershopId: service.barbershopId,
        serviceId: service.id,
        date,
      },
    });

    return booking;
  });
