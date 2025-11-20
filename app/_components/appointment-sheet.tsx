"use client";

import { Barber, BarberService } from "@/generated/prisma";
import PagamentForm, { payMethods } from "./pagament-form";
import { SpinLoader } from "./spinLoader";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Spinner } from "./ui/spinner";
import { ptBR } from "date-fns/locale";
import { isPastTimeSlot } from "@/utils/isPastTimeSlot";
import { useAction } from "next-safe-action/hooks";
import { createBookingCheckoutSession } from "../_actions/create-booking-checkout-session";
import { createBooking } from "../_actions/create-booking";
import { useState } from "react";
import { getDateAvailableTimeSlots } from "../_actions/get-date-available-time-slots";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface AppointmentSheetProps {
  setSheetOpen: (open: boolean) => void;
  service: BarberService & {
    barber: Barber;
  };
}

const AppointmentSheet = ({ setSheetOpen, service }: AppointmentSheetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [payMethod, setPayMethod] = useState<payMethods>("cartao");

  const { executeAsync, isPending: isBookingPending } =
    useAction(createBooking);
  const { executeAsync: executeCheckoutAsync, isPending: isCheckoutPending } =
    useAction(createBookingCheckoutSession);

  const selectedDateKey = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : null;

  const { data: availableTimeSlots, isPending: isAvailableTimePending } =
    useQuery<string[]>({
      queryKey: [
        "date-available-time-slots",
        service.barberId,
        selectedDateKey,
      ],
      queryFn: async () => {
        const result = await getDateAvailableTimeSlots({
          barberId: service.barberId,
          date: selectedDate!,
        });

        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.data)) return result.data;

        return [];
      },
      enabled: !!selectedDate,
    });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const isPending = isBookingPending || isCheckoutPending;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const priceInReaisInteger = Math.floor(service.priceInCents / 100);

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
    : "";

  const isConfirmDisabled = !selectedDate || !selectedTime;

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    let result;

    const timeSplitted = selectedTime.split(":");
    const hours = timeSplitted[0];
    const minutes = timeSplitted[1];

    const date = new Date(selectedDate);

    date.setHours(Number(hours), Number(minutes), 0, 0);

    if (payMethod === "cartao") {
      result = await executeCheckoutAsync({
        serviceId: service.id,
        date,
      });
    } else {
      result = await executeAsync({
        serviceId: service.id,
        date,
      });
    }

    if (result.serverError || result.validationErrors) {
      toast.error(result.validationErrors?._errors?.[0]);
      return;
    }

    if (payMethod === "cartao" && result.data && "url" in result.data) {
      if (result.data.url) {
        window.location.href = result.data.url;
        return;
      }
    }

    toast.success("Agendamento criado com sucesso!");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSheetOpen(false);
  };

  return (
    <SheetContent className="w-[370px] overflow-y-auto p-0">
      <div className="flex h-full flex-col gap-6">
        <SheetHeader className="px-5 pt-6">
          <SheetTitle className="text-lg font-bold">Fazer Reserva</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-5">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={{ before: today }}
            className="w-full p-0"
            locale={ptBR}
          />
        </div>

        {selectedDate && (
          <>
            <Separator />

            <div className="flex px-5">
              <div className="flex flex-1 items-center gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {isAvailableTimePending && (
                  <div className="flex w-full flex-1 justify-center">
                    <Spinner />
                  </div>
                )}
                {availableTimeSlots?.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "secondary"}
                    size={"sm"}
                    onClick={() => setSelectedTime(time)}
                    disabled={isPastTimeSlot(time, selectedDate!)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 px-5">
              <PagamentForm
                payMethod={payMethod}
                onPaymentMethodSelect={setPayMethod}
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-3 px-5">
              <div className="border-border bg-card flex w-full flex-col gap-3 rounded-[10px] border border-solid p-3">
                <div className="flex items-center justify-between">
                  <p className="text-card-foreground text-base font-bold">
                    {service.name}
                  </p>
                  <p className="text-card-foreground text-sm font-bold">
                    R${priceInReaisInteger},00
                  </p>
                </div>

                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <p>Método de pagamento</p>
                  <p className="capitalize">
                    {payMethod === "cartao" ? "Cartão" : payMethod}
                  </p>
                </div>
                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <p>Data</p>
                  <p>{formattedDate}</p>
                </div>

                {selectedTime && (
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <p>Horário</p>
                    <p>{selectedTime}</p>
                  </div>
                )}

                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <p>Barbearia</p>
                  <p>{service.barber.name}</p>
                </div>
              </div>
            </div>

            <div className="px-5 pb-6">
              <Button
                className="w-full rounded-full"
                disabled={isConfirmDisabled || isPending}
                onClick={handleConfirm}
              >
                {isPending ? <SpinLoader /> : "Confirmar"}
              </Button>
            </div>
          </>
        )}
      </div>
    </SheetContent>
  );
};

export default AppointmentSheet;
