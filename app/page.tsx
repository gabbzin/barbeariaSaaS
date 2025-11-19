import Image from "next/image";
import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import banner from "../public/banner.png";
import { prisma } from "@/lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "./_components/ui/page";
import Footer from "./_components/footer";
import { Alert, AlertTitle } from "./_components/ui/alert";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CheckCircleIcon, TriangleAlertIcon } from "lucide-react";

const Home = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  const recommendedBarbershops = await prisma.barber.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const popularBarbershops = await prisma.barber.findMany({
    orderBy: {
      name: "desc",
    },
  });

  return (
    <main>
      <Header />
      <div className="mx-auto w-1/2">
        <Alert variant={session ? "success" : "warn"} className="mb-2">
          <AlertTitle className="flex items-center gap-4">
            {session?.user.name ? (
              <>
                <CheckCircleIcon />
                <p>Logado com sucesso: Olá, + {session.user.name}!</p>
              </>
            ) : (
              <>
                <TriangleAlertIcon />
                <p>Login não realizado ainda</p>
              </>
            )}
          </AlertTitle>
        </Alert>
        <Alert variant={"warn"} className="mb-2">
          <AlertTitle className="flex items-center gap-4">
            <TriangleAlertIcon />
            <p>
              O sistema está em fase alpha, para realizar agendamentos é
              necessário estar logado.
            </p>
          </AlertTitle>
        </Alert>
      </div>
      <PageContainer>
        <SearchInput />
        <Image
          src={banner} // Fazemos isso para otimizar a imagem e evitar problemas de Cumulative Layout Shift (CLS)
          alt="Banner"
          sizes="100vw"
          className="h-auto w-full"
        />

        <PageSection>
          <PageSectionTitle>Agendamentos</PageSectionTitle>
        </PageSection>

        <PageSection>
          <PageSectionTitle>Barbearias</PageSectionTitle>
          <PageSectionScroller>
            {recommendedBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSection>

        <PageSection>
          <PageSectionTitle>Recomendados</PageSectionTitle>
          <PageSectionScroller>
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSection>
      </PageContainer>
      <Footer />
    </main>
  );
};

export default Home;
