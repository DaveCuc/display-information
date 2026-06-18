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
    // Obtener eventos desde ahora hasta el final del día, o +24 horas si lo prefieres
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: endOfDay.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    // Formatear eventos para la UI
    const formattedEvents = events.map((event, index) => {
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
      };
    });

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
