import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { google } from "googleapis";
import { format, formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const now = new Date();
    // En Vercel el servidor está en UTC, por lo que calcular 'endOfDay' falla 
    // dependiendo de la zona horaria del usuario. Es más seguro pedir los 
    // eventos de los próximos 7 días para que nunca se quede vacío el tablero.
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

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
      const startDateTime = event.start?.dateTime || event.start?.date;
      const startDate = startDateTime ? new Date(startDateTime) : now;
      
      const endDateTime = event.end?.dateTime || event.end?.date;
      const endDate = endDateTime ? new Date(endDateTime) : new Date(startDate.getTime() + 3600000); // fallback to 1 hour after start
      
      
      const isMain = index === 0; // El primero es el más próximo
      
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
