import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import BookingItem from "@/app/_components/booking-item";
import { PageContainer, PageSection } from "../_components/ui/page";

const BookingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      service: true,
      barbershop: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const now = new Date();

  const confirmedBookings = bookings.filter(
    (booking) => booking.date > now && !booking.cancelled,
  );

  const cancelledBookings = bookings.filter((booking) => booking.cancelled);

  const finishedBookings = bookings.filter(
    (booking) => booking.date <= now && !booking.cancelled,
  );

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-between">
      <div>
        <Header />
        <PageContainer>
          <h1 className="text-xl font-bold">Agendamentos</h1>
          <PageSection>
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
                  booking={{
                    id: booking.id,
                    date: booking.date,
                    service: {
                      name: booking.service.name,
                      priceInCents: booking.service.priceInCents,
                    },
                    barbershop: {
                      name: booking.barbershop.name,
                      address: booking.barbershop.address,
                      imageUrl: booking.barbershop.imageUrl,
                      phones: booking.barbershop.phones,
                    },
                  }}
                  status="confirmed"
                />
              ))
            )}
          </PageSection>
          <PageSection>
            <h2 className="text-muted-foreground text-xs font-bold uppercase">
              Cancelados
            </h2>
            {cancelledBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Você não tem agendamentos cancelados.
              </p>
            ) : (
              cancelledBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={{
                    id: booking.id,
                    date: booking.date,
                    service: {
                      name: booking.service.name,
                      priceInCents: booking.service.priceInCents,
                    },
                    barbershop: {
                      name: booking.barbershop.name,
                      address: booking.barbershop.address,
                      imageUrl: booking.barbershop.imageUrl,
                      phones: booking.barbershop.phones,
                    },
                  }}
                  status="cancelled"
                />
              ))
            )}
          </PageSection>
          <PageSection>
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
                  booking={{
                    id: booking.id,
                    date: booking.date,
                    service: {
                      name: booking.service.name,
                      priceInCents: booking.service.priceInCents,
                    },
                    barbershop: {
                      name: booking.barbershop.name,
                      address: booking.barbershop.address,
                      imageUrl: booking.barbershop.imageUrl,
                      phones: booking.barbershop.phones,
                    },
                  }}
                  status="finished"
                />
              ))
            )}
          </PageSection>
        </PageContainer>
      </div>

      <Footer />
    </div>
  );
};

export default BookingsPage;
