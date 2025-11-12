import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import BookingItem from "@/app/_components/booking-item";

const BookingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/");
  }

  const userId = session.user.id;

  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      service: true,
      barbershop: true,
    },
    orderBy: { date: "asc" },
  });

  const now = new Date();

  const confirmedBookings = bookings.filter(
    (booking) => booking.date > now && !booking.cancelled,
  );

  const finishedBookings = bookings.filter(
    (booking) => booking.date <= now || booking.cancelled,
  );

  return (
    <>
      <Header />

      <div className="space-y-6 px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <div className="space-y-3">
          <h2 className="text-muted-foreground text-xs font-bold uppercase">
            Confirmados
          </h2>
          {confirmedBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Você não tem agendamentos confirmados.
            </p>
          ) : (
            confirmedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                serviceName={booking.service.name}
                barbershopName={booking.barbershop.name}
                barbershopImageUrl={booking.barbershop.imageUrl}
                date={booking.date}
                status="confirmed"
              />
            ))
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-muted-foreground text-xs font-bold uppercase">
            Finalizados
          </h2>
          {finishedBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Você não tem agendamentos finalizados.
            </p>
          ) : (
            finishedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                serviceName={booking.service.name}
                barbershopName={booking.barbershop.name}
                barbershopImageUrl={booking.barbershop.imageUrl}
                date={booking.date}
                status="finished"
              />
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookingsPage;
