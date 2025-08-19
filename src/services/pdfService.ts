// PDF Generation Service

import { Agreement } from "@/hooks/useSupabaseAgreements";

export interface PDFGenerationOptions {
  title: string;
  content: string;
  fileName?: string;
  includeHeader?: boolean;
  includeFooter?: boolean;
  pageNumbers?: boolean;
}

// Mock PDF generation service - in production, use libraries like jsPDF, react-to-pdf, or server-side PDF generation
export const generatePDF = async (options: PDFGenerationOptions): Promise<string> => {
  const { title, content, fileName = 'agreement.pdf', includeHeader = true, includeFooter = true, pageNumbers = true } = options;

  // Simulate PDF generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Create HTML content for PDF
  const htmlContent = createHTMLForPDF(title, content, includeHeader, includeFooter, pageNumbers);

  // In production, this would generate actual PDF using:
  // - jsPDF library
  // - html2canvas + jsPDF
  // - Server-side PDF generation (Puppeteer, wkhtmltopdf)
  // - React-PDF or similar libraries

  // For demo purposes, create a data URL that represents the PDF
  const pdfDataUrl = `data:application/pdf;base64,${btoa(htmlContent)}`;

  return pdfDataUrl;
};

export const downloadPDF = async (agreement: Agreement): Promise<void> => {
  try {
    const pdfDataUrl = await generatePDF({
      title: agreement.title,
      content: agreement.content,
      fileName: `${agreement.title.replace(/\s+/g, '_')}.pdf`
    });

    // Create downloadable link
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = `${agreement.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

const createHTMLForPDF = (title: string, content: string, includeHeader: boolean, includeFooter: boolean, pageNumbers: boolean): string => {
  const currentDate = new Date().toLocaleDateString('en-IN');
  const currentTime = new Date().toLocaleTimeString('en-IN');

  // Convert markdown-like content to HTML
  const htmlContent = markdownToHTML(content);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @page {
            size: A4;
            margin: 1in;
            ${pageNumbers ? '@bottom-right { content: "Page " counter(page) " of " counter(pages); }' : ''}
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 18pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }
        
        .document-info {
            font-size: 10pt;
            margin-top: 10px;
        }
        
        .content {
            text-align: justify;
        }
        
        .content h1 {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            margin: 30px 0 20px 0;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
        }
        
        .content h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 25px 0 15px 0;
        }
        
        .content h3 {
            font-size: 12pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
        }
        
        .content p {
            margin: 10px 0;
        }
        
        .content ul, .content ol {
            margin: 10px 0 10px 20px;
        }
        
        .content li {
            margin: 5px 0;
        }
        
        .content table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .content table, .content th, .content td {
            border: 1px solid #000;
        }
        
        .content th, .content td {
            padding: 8px;
            text-align: left;
        }
        
        .content th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        
        .signatures {
            margin-top: 50px;
            page-break-inside: avoid;
        }
        
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }
        
        .signature-block {
            width: 45%;
            text-align: center;
        }
        
        .signature-line {
            border-bottom: 1px solid #000;
            width: 200px;
            margin: 30px auto 10px auto;
        }
        
        .footer {
            border-top: 1px solid #ccc;
            padding-top: 20px;
            margin-top: 50px;
            text-align: center;
            font-size: 10pt;
            color: #666;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
        
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 48pt;
            color: rgba(200, 200, 200, 0.1);
            z-index: -1;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="watermark">AGREEMENT GENERATOR</div>
    
    ${includeHeader ? `
    <div class="header">
        <h1>${title}</h1>
        <div class="document-info">
            Generated on: ${currentDate} at ${currentTime}<br>
            Document ID: AGR-${Date.now()}<br>
            Generated by: Agreement Generator Pro
        </div>
    </div>
    ` : ''}
    
    <div class="content">
        ${htmlContent}
    </div>
    
    ${includeFooter ? `
    <div class="footer">
        <hr>
        <p>
            <strong>Disclaimer:</strong> This document was generated using Agreement Generator Pro. 
            While every effort has been made to ensure accuracy and compliance with applicable laws, 
            it is recommended to consult with a qualified legal professional before executing this agreement.
        </p>
        <p>
            Generated on ${currentDate} | © Agreement Generator Pro
        </p>
    </div>
    ` : ''}
</body>
</html>
  `;
};

const markdownToHTML = (markdown: string): string => {
  let html = markdown;

  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Convert bold text
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');

  // Convert line breaks
  html = html.replace(/\n\n/gim, '</p><p>');
  html = html.replace(/\n/gim, '<br>');

  // Wrap in paragraphs
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/gim, '');
  html = html.replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/gim, '$1');

  // Convert tables (basic support)
  html = html.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map((cell: string) => cell.trim());
    return '<tr>' + cells.map((cell: string) => `<td>${cell}</td>`).join('') + '</tr>';
  });

  // Wrap tables
  if (html.includes('<tr>')) {
    html = html.replace(/(<tr>.*<\/tr>)/gims, '<table>$1</table>');
  }

  // Convert horizontal rules
  html = html.replace(/^---$/gim, '<hr>');

  return html;
};

export const printAgreement = (agreement: Agreement): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = createHTMLForPDF(agreement.title, agreement.content, true, true, false);
  
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  printWindow.onload = () => {
    printWindow.print();
  };
};