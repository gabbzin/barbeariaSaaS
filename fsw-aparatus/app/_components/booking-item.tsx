"use client";

import { useState } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { CancelBooking } from "./cancel-booking";

interface BookingItemProps {
  booking: {
    id: string;
    date: Date;
    service: {
      name: string;
      priceInCents: number;
    };
    barbershop: {
      name: string;
      address: string;
      imageUrl: string;
      phones: string[];
    };
  };
  status: "confirmed" | "finished";
}

const BookingItem = ({ booking, status }: BookingItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <Card
        className="flex w-full min-w-full cursor-pointer flex-row items-center justify-between p-0 transition-opacity hover:opacity-75"
        onClick={() => setIsSheetOpen(true)}
      >
        {/* ESQUERDA */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Badge variant={status === "confirmed" ? "default" : "secondary"}>
            {status === "confirmed" ? "CONFIRMADO" : "FINALIZADO"}
          </Badge>
          <div className="flex flex-col gap-2">
            <p className="font-bold">{booking.service.name}</p>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={booking.barbershop.imageUrl} />
              </Avatar>
              <p className="text-xs font-bold">{booking.barbershop.name}</p>
            </div>
          </div>
        </div>

        {/* DIREITA */}
        <div className="flex h-full flex-col items-center justify-center border-l p-4 py-3">
          <p className="text-xs capitalize">
            {booking.date.toLocaleDateString("pt-BR", { month: "long" })}
          </p>
          <p className="text-xl font-semibold capitalize">
            {booking.date.toLocaleDateString("pt-BR", { day: "2-digit" })}
          </p>
          <p className="text-xs capitalize">
            {booking.date.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </Card>

      <CancelBooking
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        booking={booking}
        status={status}
      />
    </>
  );
};

export default BookingItem;
