import ical, { type VEvent } from "node-ical";

export type CalendarBooking = {
  start: string;
  end: string;
};

function isVEvent(component: unknown): component is VEvent {
  return (
    !!component &&
    typeof component === "object" &&
    (component as { type?: string }).type === "VEVENT"
  );
}

export async function fetchIcalBookings(icalUrl: string): Promise<CalendarBooking[]> {
  const events = await ical.async.fromURL(icalUrl);

  const bookings: CalendarBooking[] = [];

  for (const component of Object.values(events)) {
    if (!isVEvent(component)) continue;
    if (!component.start || !component.end) continue;

    bookings.push({
      start: new Date(component.start).toISOString().slice(0, 10),
      end: new Date(component.end).toISOString().slice(0, 10),
    });
  }

  return bookings;
}
