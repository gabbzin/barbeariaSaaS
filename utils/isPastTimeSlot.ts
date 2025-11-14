// utils/isPastTimeSlot.ts

export function isPastTimeSlot(time: string, selectedDate: Date): boolean {
  if (!selectedDate) return true;

  const today = new Date();

  // Verifica se a data selecionada é hoje
  const isToday = selectedDate.toDateString() === today.toDateString();

  if (!isToday) return false;

  // Hora atual
  const now = today.getTime();

  // Converte "HH:mm" em um Date real baseado no selectedDate
  const [hour, minute] = time.split(":").map(Number);

  const slotDate = new Date(selectedDate);
  slotDate.setHours(hour, minute, 0, 0);

  // Se o horário do slot for antes do agora → desabilita
  return slotDate.getTime() < now;
}
