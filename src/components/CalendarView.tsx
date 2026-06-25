"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { subscribeToTasks } from "@/services/task.service";
import { useAuth } from "@/contexts/AuthContext";
import { Modal } from "./Modal";

export function CalendarView() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsub = subscribeToTasks(
      user.uid,
      (tasks) => {
        setEvents(
          tasks
            .filter((t) => t.dueDate)
            .map((t) => ({ id: t.id, title: t.title, start: t.dueDate, extendedProps: t }))
        );
      },
      () => {},
    );

    return unsub;
  }, [user]);

  function handleEventClick(info: any) {
    setSelected(info.event.extendedProps);
    setOpen(true);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        eventColor="#2563eb"
        eventTextColor="#ffffff"
        dayCellClassNames={() => ["text-slate-900"]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek"
        }}
        dayHeaderContent={(args) => <strong className="text-slate-900">{args.text}</strong>}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        {selected ? (
          <div>
            <h3 className="text-lg font-bold text-slate-950">{selected.title}</h3>
            <p className="mt-2 text-sm text-slate-700">{selected.description}</p>
            <p className="mt-2 text-sm text-slate-600">Vencimento: {selected.dueDate}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default CalendarView;
