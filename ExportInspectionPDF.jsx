import React from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const ExportInspectionPDF = ({ landlord, tenant, rooms }) => {
  const createPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title page
    const page = pdfDoc.addPage();
    page.setFont(font);
    page.setFontSize(20);
    page.drawText("Move-in/Move-out Inspection Report", { x: 50, y: 750, color: rgb(0, 0, 0) });

    page.setFontSize(12);
    page.drawText(`Landlord: ${landlord.name} | Phone: ${landlord.phone} | Email: ${landlord.email}`, { x: 50, y: 720 });
    page.drawText(`Tenant: ${tenant.name} | Phone: ${tenant.phone} | Email: ${tenant.email}`, { x: 50, y: 700 });

    // For each room
    let y = 660;
    for (const room of rooms) {
      page.drawText(`Room: ${room.name}`, { x: 50, y });
      y -= 20;

      // Add photo if exists
      if (room.imagePreview) {
        const imgBytes = await fetch(room.imagePreview).then(res => res.arrayBuffer());
        let img;
        if (room.imagePreview.startsWith("data:image/png")) {
          img = await pdfDoc.embedPng(imgBytes);
        } else {
          img = await pdfDoc.embedJpg(imgBytes);
        }
        const imgDims = img.scale(0.2); // scale as needed
        page.drawImage(img, { x: 50, y: y - imgDims.height, width: imgDims.width, height: imgDims.height });
        y -= (imgDims.height + 10);
      }

      // Draw objects table
      if (room.objects && room.objects.length > 0) {
        page.drawText("Objects:", { x: 50, y });
        y -= 15;
        page.drawText("No   Object         Status      Description", { x: 60, y });
        y -= 15;
        room.objects.forEach((obj, idx) => {
          page.drawText(
            `${idx + 1}   ${obj.label}   ${obj.status}   ${obj.description || ""}`,
            { x: 60, y }
          );
          y -= 15;
        });
      }
      y -= 30;
      if (y < 120) {
        y = 750;
        pdfDoc.addPage();
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inspection_report.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={createPDF}>Download PDF Report</button>
  );
};

export default ExportInspectionPDF;