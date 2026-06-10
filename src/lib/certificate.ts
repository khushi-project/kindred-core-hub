import jsPDF from "jspdf";

export interface CertOptions {
  volunteerName: string;
  eventTitle: string;
  eventDate: string;
  hours: number;
  certificateCode: string;
  organization?: string;
}

export function downloadCertificate(opts: CertOptions) {
  const { volunteerName, eventTitle, eventDate, hours, certificateCode, organization = "Volunc" } = opts;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Dark navy background
  doc.setFillColor(10, 22, 48);
  doc.rect(0, 0, W, H, "F");

  // Inner gold border
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(2);
  doc.rect(25, 25, W - 50, H - 50);
  doc.setLineWidth(0.5);
  doc.rect(35, 35, W - 70, H - 70);

  // Header bar
  doc.setFillColor(15, 35, 75);
  doc.rect(35, 35, W - 70, 70, "F");

  // Org name
  doc.setTextColor(212, 175, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(organization.toUpperCase(), W / 2, 80, { align: "center" });

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(34);
  doc.text("CERTIFICATE OF PARTICIPATION", W / 2, 175, { align: "center" });

  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1.2);
  doc.line(W / 2 - 90, 195, W / 2 + 90, 195);

  // Intro
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(200, 210, 230);
  doc.text("This is proudly presented to", W / 2, 235, { align: "center" });

  // Volunteer name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text(volunteerName, W / 2, 290, { align: "center" });

  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  doc.line(W / 2 - 200, 310, W / 2 + 200, 310);

  // Body
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(200, 210, 230);
  const body = `for outstanding contribution and dedicated participation in`;
  doc.text(body, W / 2, 345, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(212, 175, 55);
  doc.text(`"${eventTitle}"`, W / 2, 375, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(200, 210, 230);
  doc.text(`held on ${new Date(eventDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}  •  ${hours} volunteer hours`, W / 2, 400, { align: "center" });

  // Footer signatures
  const sigY = H - 90;
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.6);
  doc.line(120, sigY, 280, sigY);
  doc.line(W - 280, sigY, W - 120, sigY);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Program Director", 200, sigY + 18, { align: "center" });
  doc.text(organization, W - 200, sigY + 18, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(170, 180, 200);
  doc.text(`Certificate ID: ${certificateCode}`, W / 2, H - 50, { align: "center" });
  doc.text(`Issued: ${new Date().toLocaleDateString()}`, W / 2, H - 36, { align: "center" });

  doc.save(`${organization}-Certificate-${certificateCode}.pdf`);
}