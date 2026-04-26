import jsPDF from "jspdf";
import QRCode from "qrcode";

export const generateTicketPDF = async (booking: any) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [100, 180], // Custom ticket size (narrower and taller)
  });

  const { movie, screen } = booking.showtime;
  const { theater } = screen;
  const primaryColor = [248, 69, 101]; // #F84565

  // --- Background & Border ---
  doc.setFillColor(20, 20, 22); // Dark background
  doc.rect(0, 0, 100, 180, "F");

  // --- Header Area ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 100, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("OFFICIAL MOVIE TICKET", 50, 15, { align: "center" });

  doc.setFontSize(16);
  doc.text("ADMIT ONE", 50, 25, { align: "center" });

  // --- Movie Title ---
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(movie.title.toUpperCase(), 80);
  doc.text(titleLines, 50, 55, { align: "center" });

  // --- Decorative Line ---
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 65, 85, 65);

  // --- Ticket Details ---
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("THEATER", 15, 75);
  doc.text("SCREEN", 70, 75);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(theater.name, 15, 82);
  doc.text(screen.name, 70, 82);

  // Address (small)
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  const addrLines = doc.splitTextToSize(theater.address, 40);
  doc.text(addrLines, 15, 87);

  // Date & Time
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text("DATE", 15, 105);
  doc.text("TIME", 70, 105);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(new Date(booking.showtime.startTime).toLocaleDateString(), 15, 112);
  doc.text(
    new Date(booking.showtime.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    70,
    112,
  );

  // Seats
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text("RESERVED SEATS", 15, 125);

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const seatText = booking.seats
    .map((s: any) => `${s.seat.row}${s.seat.number}`)
    .join(", ");
  doc.text(seatText, 15, 133);

  // --- QR Code ---
  const qrData = `BOOKING_ID:${booking.id}`;
  const qrImage = await QRCode.toDataURL(qrData, {
    color: {
      dark: "#FFFFFF",
      light: "#141416",
    },
    margin: 1,
  });
  doc.addImage(qrImage, "PNG", 35, 140, 30, 30);

  // Booking ID (rotated or at bottom)
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.setFont("courier", "normal");
  doc.text(`ID: ${booking.id}`, 50, 175, { align: "center" });

  // Decorative side punch holes (visual only)
  doc.setFillColor(9, 9, 11);
  doc.circle(0, 90, 5, "F");
  doc.circle(100, 90, 5, "F");

  // Save
  doc.save(
    `Ticket-${movie.title.replace(/\s+/g, "-")}-${booking.id.substring(0, 8)}.pdf`,
  );
};
