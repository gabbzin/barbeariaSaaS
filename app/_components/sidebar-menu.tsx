"use client";

import { authClient } from "@/lib/auth-client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon, Home, Calendar, LogOut, LogIn } from "lucide-react";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Cabelo",
  "Barba",
  "Acabamento",
  "Sombrancelha",
  "Massagem",
  "Hidratação",
];

export const SidebarMenu = () => {
  const { data: session } = authClient.useSession();

  const { push } = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[90vw] max-w-[370px] gap-6 p-0">
        <SheetHeader className="px-5 py-2 text-left">
          <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
        </SheetHeader>

        <Separator />

        {session ? (
          <div className="flex items-center gap-3 px-5">
            <Avatar className="size-12">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>
                {session.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <p className="text-foreground text-base font-semibold">
                {session.user.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {session.user.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5">
            <div className="flex h-12 items-center">
              <p className="text-foreground text-base leading-tight font-semibold">
                Olá. Faça seu login!
              </p>
            </div>
            <Button
              onClick={() => push("/login")}
              className="gap-3 rounded-full px-6"
              size="sm"
            >
              <span className="text-sm font-semibold">Login</span>
              <LogIn className="size-4" />
            </Button>
          </div>
        )}

        <div className="flex w-full flex-col">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-full px-5 py-3"
            asChild
          >
            <Link href="/">
              <Home className="size-4" />
              <span className="text-sm font-medium">Início</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-full px-5 py-3"
            asChild
          >
            <Link href="/bookings">
              <Calendar className="size-4" />
              <span className="text-sm font-medium">Agendamentos</span>
            </Link>
          </Button>
        </div>

        <Separator />

        <div className="flex w-full flex-col gap-1">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className="h-10 w-full justify-start rounded-full px-5 py-3"
            >
              <span className="text-sm font-medium">{category}</span>
            </Button>
          ))}
        </div>

        <Separator />

        {session && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-full px-5 py-3"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span className="text-muted-foreground text-sm font-medium">
              Sair da conta
            </span>
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};
