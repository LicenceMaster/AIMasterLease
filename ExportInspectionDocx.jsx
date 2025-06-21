import React from "react";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, ImageRun, AlignmentType, WidthType } from "docx";

const ExportInspectionDocx = ({ landlord, tenant, rooms }) => {
  // Converts base64 image to ArrayBuffer
  const dataURLtoArrayBuffer = dataURL => {
    const base64 = dataURL.split(',')[1];
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  };

  const createDocx = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Move-in / Move-out Inspection Report",
            heading: HeadingLevel.HEADING1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({}),
          new Paragraph({
            text: `Landlord: ${landlord.name} | Phone: ${landlord.phone} | Email: ${landlord.email}`,
          }),
          new Paragraph({
            text: `Tenant: ${tenant.name} | Phone: ${tenant.phone} | Email: ${tenant.email}`,
          }),
          new Paragraph({}),
          ...rooms.flatMap((room, idx) => {
            const children = [
              new Paragraph({
                text: `Room: ${room.name}`,
                heading: HeadingLevel.HEADING2,
                spacing: { after: 100 },
              }),
            ];

            // Add photo
            if (room.imagePreview) {
              try {
                const imageBuffer = dataURLtoArrayBuffer(room.imagePreview);
                children.push(
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: imageBuffer,
                        transformation: { width: 320, height: 180 },
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                  })
                );
              } catch (err) {
                // ignore error
              }
            }

            // Add objects table
            if (room.objects && room.objects.length > 0) {
              children.push(
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                    new TableRow({
                      tableHeader: true,
                      children: [
                        new TableCell({children: [new Paragraph("No")]}),
                        new TableCell({children: [new Paragraph("Object")]}),
                        new TableCell({children: [new Paragraph("Status")]}),
                        new TableCell({children: [new Paragraph("Description")]}),
                      ],
                    }),
                    ...room.objects.map((obj, i) =>
                      new TableRow({
                        children: [
                          new TableCell({children: [new Paragraph(String(i + 1))]}),
                          new TableCell({children: [new Paragraph(obj.label)]}),
                          new TableCell({children: [new Paragraph(obj.status)]}),
                          new TableCell({children: [new Paragraph(obj.description || "")]}),
                        ],
                      })
                    ),
                  ],
                })
              );
            }
            children.push(new Paragraph({})); // add space
            return children;
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inspection_report.docx";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={createDocx}>Download Word Report</button>
  );
};

export default ExportInspectionDocx;