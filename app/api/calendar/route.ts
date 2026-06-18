import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { google } from "googleapis";
import { format, formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";

export async function GET(request: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const now = new Date();
    // Pedir eventos de los próximos 7 días como estaba antes
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // 1. Fetch list of all calendars
    const calendarListRes = await calendar.calendarList.list();
    const calendars = calendarListRes.data.items || [];

    // 2. Fetch events concurrently from all calendars
    const allEventsPromises = calendars.map(async (cal) => {
      try {
        const res = await calendar.events.list({
          calendarId: cal.id as string,
          timeMin: now.toISOString(),
          timeMax: futureDate.toISOString(),
          maxResults: 15,
          singleEvents: true,
          orderBy: "startTime",
        });
        
        // Inject calendar metadata into each event
        return (res.data.items || []).map((event) => ({
          ...event,
          calendarName: cal.summary || "Calendario",
          calendarColor: cal.backgroundColor || "#4285F4"
        }));
      } catch (err) {
        console.error(`Error fetching events for calendar ${cal.summary}:`, err);
        return [];
      }
    });

    const eventsArrays = await Promise.all(allEventsPromises);
    const allEvents = eventsArrays.flat();

    // 3. Sort chronologically globally
    allEvents.sort((a, b) => {
      const aStart = new Date(a.start?.dateTime || a.start?.date || 0).getTime();
      const bStart = new Date(b.start?.dateTime || b.start?.date || 0).getTime();
      return aStart - bStart;
    });
    // 4. Take the closest 15 events globally
    const topEvents = allEvents.slice(0, 15);

    // Formatear eventos para la UI
    const formattedEvents = topEvents.map((event: any, index) => {
      // Si es un evento de todo el día, Google envía solo 'date' (ej. 2026-06-18).
      // Al hacer new Date("2026-06-18") JS lo toma como medianoche UTC, lo que
      // causa que en zonas horarias como México (UTC-6) se atrase al día anterior.
      // Solución: Forzar la hora a medio día (T12:00:00Z) asegura que siempre caiga en el día correcto en cualquier zona horaria.
      let startDateTime = event.start?.dateTime;
      if (!startDateTime && event.start?.date) {
        startDateTime = `${event.start.date}T12:00:00Z`;
      }
      const startDate = startDateTime ? new Date(startDateTime) : now;
      
      let endDateTime = event.end?.dateTime;
      if (!endDateTime && event.end?.date) {
        endDateTime = `${event.end.date}T12:00:00Z`;
      }
      const endDate = endDateTime ? new Date(endDateTime) : new Date(startDate.getTime() + 3600000);
      
      const isMain = index === 0;
      
      let remainingTime = "";
      if (isMain) {
        remainingTime = `En ${formatDistanceToNowStrict(startDate, { locale: es })}`;
      }

      return {
        id: event.id,
        title: event.summary || "Evento sin título",
        description: event.description || "",
        time: format(startDate, "HH:mm"),
        remainingTime,
        startTimeIso: startDate.toISOString(),
        endTimeIso: endDate.toISOString(),
        isMain,
        calendarName: event.calendarName,
        calendarColor: event.calendarColor,
      };
    });

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
