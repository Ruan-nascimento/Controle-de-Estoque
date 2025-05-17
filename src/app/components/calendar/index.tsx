'use client';

import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale'; 

interface CalendarComponentProps {
  setData: (val:Date | undefined) => void
}

export default function CalendarComponent({setData}:CalendarComponentProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setData(date)
  }, [date])

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md"
      initialFocus
      locale={ptBR}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 text-white',
        month: 'space-y-4 bg-zinc-900 rounded-xl border p-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-bold',
        nav: 'space-x-1 flex items-center',
        nav_button: cn('h-7 w-7 bg-transparent cursor-pointer p-0 opacity-50 hover:opacity-100 hover:text-cyan-600', 'rounded-md border'),
        table: 'w-full bg-zinc-900 rounded-md border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-3',
        cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn('h-9 w-9 p-0 font-normal aria-selected:opacity-100', 'hover:bg-primary/10 hover:text-primary'),
        day_selected: 'bg-cyan-600 text-white rounded-md ',
        day_today: 'bg-cyan-900 rounded-md text-white',
        day_outside: 'text-muted-foreground opacity-50 text-cyan-600',
        
      }}
    />
  );
}