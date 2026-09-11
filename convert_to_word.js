import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx';
import fs from 'fs';
import path from 'path';

// Parse markdown file and convert to Word document
const mdPath = 'C:\\Users\\Mohd Asif\\.gemini\\antigravity-ide\\brain\\670c4246-d652-4078-8de5-bdfaec5da88e\\sap_ap_automation_client_documentation.md';
const docxPathScratch = 'C:\\Users\\Mohd Asif\\.gemini\\antigravity-ide\\scratch\\sap-ap-automation\\Enterprise_SAP_AP_Automation_Client_Documentation.docx';
const docxPathBrain = 'C:\\Users\\Mohd Asif\\.gemini\\antigravity-ide\\brain\\670c4246-d652-4078-8de5-bdfaec5da88e\\Enterprise_SAP_AP_Automation_Client_Documentation.docx';

const content = fs.readFileSync(mdPath, 'utf8');
const lines = content.split('\n');

const docParagraphs = [];

// Header Title Banner
docParagraphs.push(
  new Paragraph({
    text: "Enterprise AI-Powered SAP Accounts Payable (AP) Automation Platform",
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 }
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: "Executive Client Proposal, Solution Architecture & Handover Documentation",
        bold: true,
        size: 24,
        color: "0070F2"
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 }
  })
);

let inTable = false;
let tableRowsData = [];

lines.forEach((line) => {
  const trimmed = line.trim();

  // Table Parser
  if (trimmed.startsWith('|')) {
    if (trimmed.includes('---')) return; // Skip separator line
    const cells = trimmed.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
    tableRowsData.push(cells);
    inTable = true;
    return;
  } else if (inTable) {
    // Flush table
    if (tableRowsData.length > 0) {
      const tableRows = tableRowsData.map((rowCells, rowIndex) => {
        return new TableRow({
          children: rowCells.map(cellText => {
            return new TableCell({
              children: [new Paragraph({
                children: [new TextRun({
                  text: cellText.replace(/\*\*/g, ''),
                  bold: rowIndex === 0,
                  color: rowIndex === 0 ? "FFFFFF" : "1E293B"
                })],
                spacing: { before: 100, after: 100 }
              })],
              shading: rowIndex === 0 ? { fill: "0070F2" } : (rowIndex % 2 === 0 ? { fill: "F1F5F9" } : { fill: "FFFFFF" }),
              width: { size: 100 / rowCells.length, type: WidthType.PERCENTAGE }
            });
          })
        });
      });

      docParagraphs.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE }
        }),
        new Paragraph({ text: "", spacing: { after: 200 } })
      );

      tableRowsData = [];
    }
    inTable = false;
  }

  // Headings
  if (trimmed.startsWith('# ')) {
    docParagraphs.push(
      new Paragraph({
        text: trimmed.replace('# ', ''),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 150 }
      })
    );
  } else if (trimmed.startsWith('## ')) {
    docParagraphs.push(
      new Paragraph({
        text: trimmed.replace('## ', ''),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 250, after: 120 }
      })
    );
  } else if (trimmed.startsWith('### ')) {
    docParagraphs.push(
      new Paragraph({
        text: trimmed.replace('### ', ''),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      })
    );
  } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "•  " + trimmed.substring(2).replace(/\*\*/g, ''), size: 22 })
        ],
        spacing: { after: 80 }
      })
    );
  } else if (trimmed.startsWith('> [!')) {
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: trimmed.replace('> [!', '').replace(']', ':'), bold: true, color: "0070F2" })
        ],
        spacing: { before: 100, after: 60 }
      })
    );
  } else if (trimmed.startsWith('> ')) {
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: trimmed.replace('> ', '').replace(/\*\*/g, ''), italic: true, color: "334155" })
        ],
        spacing: { after: 100 }
      })
    );
  } else if (trimmed.length > 0 && !trimmed.startsWith('```')) {
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: trimmed.replace(/\*\*/g, ''), size: 22 })
        ],
        spacing: { after: 120 }
      })
    );
  }
});

const doc = new Document({
  sections: [{
    properties: {},
    children: docParagraphs
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(docxPathScratch, buffer);
  fs.writeFileSync(docxPathBrain, buffer);
  console.log(`=======================================================`);
  console.log(` Successfully generated Word (.docx) client document!`);
  console.log(` File Saved to: ${docxPathScratch}`);
  console.log(`=======================================================`);
});
