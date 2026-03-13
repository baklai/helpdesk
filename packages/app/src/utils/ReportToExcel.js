import ExcelJS from 'exceljs';

const calculateRowHeight = (text, columnWidth, fontSize = 14) => {
  const charactersPerLine = columnWidth * 1.2;
  const lineCount = Math.ceil(text.length / charactersPerLine);
  const lineHeight = fontSize * 1.5;
  return (lineCount * lineHeight) / 14;
};

const rowsRender = (worksheet, rows) => {
  rows.forEach(({ row, value = '', mergeRange = 'A:F', alignment = {}, font = {} }) => {
    const [startCol, endCol] = mergeRange.split(':');

    worksheet.mergeCells(`${startCol}${row}:${endCol}${row}`);

    const cell = worksheet.getCell(`${startCol}${row}`);
    cell.value = value;
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
      ...alignment
    };
    cell.font = { name: 'Times New Roman', size: 14, ...font };
  });
};

const headTableRender = ({ worksheet, rowIndex, headers, headerHeight = 125 }) => {
  const headerRow = worksheet.getRow(rowIndex);

  headerRow.values = headers.map(({ header }) => header);

  headerRow.height = headerHeight;

  headerRow.eachCell(cell => {
    cell.font = { name: 'Times New Roman', size: 12, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  headers.forEach(({ width }, index) => {
    worksheet.getColumn(index + 1).width = width;
  });
};

const dataTableRender = ({ worksheet, rowIndex, headers, styles, data }) => {
  data.forEach((item, index) => {
    const row = worksheet.getRow(rowIndex + index + 1);
    Object.values(item).forEach((value, colIndex) => {
      const cell = row.getCell(colIndex + 1);
      cell.value = value;
      cell.font = styles[colIndex].font;
      cell.alignment = styles[colIndex].alignment;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      if (styles[colIndex]?.numFmt) {
        cell.numFmt = styles[colIndex].numFmt;
      }
    });
  });

  data.forEach((item, index) => {
    const row = worksheet.getRow(rowIndex + index + 1);
    let maxLines = 1;
    headers.forEach((header, colIndex) => {
      if (item[header.key]) {
        const text = item[header.key].toString();
        const columnWidth = worksheet.getColumn(colIndex + 1).width || 10;
        const estimatedLines = Math.ceil(text.length / columnWidth);
        maxLines = Math.max(maxLines, estimatedLines);
      }
    });

    row.height = maxLines * 15;
  });
};

export const servicesJobCountReport = async (records, totalJobCount, datetime) => {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet('СЕРВІСИ');

  rowsRender(worksheet, [
    {
      row: 2,
      mergeRange: 'A:D',
      value: 'Перелік послуг, які надаються ВП "Східне відділення" філії "ГІОЦ" АТ "Укрзалізниця"',
      font: { name: 'Times New Roman', size: 14, bold: true },
      alignment: { vertical: 'middle', horizontal: 'center' }
    },
    {
      row: 3,
      mergeRange: 'A:D',
      value: 'регіональній філії "Донецька залізниця" та іншим філіям АТ "Укрзалізниця"',
      font: { name: 'Times New Roman', size: 14, bold: true },
      alignment: { vertical: 'middle', horizontal: 'center' }
    }
  ]);

  const headers = [
    { header: '№ п/п', key: 'index', width: 10 },
    { header: 'Код роботи', key: 'code', width: 20 },
    { header: 'Назва системи', key: 'name', width: 100 },
    { header: 'Кількість обслугованих АРМів або наданих послуг', key: 'totalCount', width: 25 }
  ];

  const styles = [
    {
      font: { name: 'Times New Roman', size: 11 },
      alignment: { vertical: 'middle', horizontal: 'center' }
    },
    {
      font: { name: 'Times New Roman', size: 11 },
      alignment: { vertical: 'middle', horizontal: 'left' }
    },
    {
      font: { name: 'Times New Roman', size: 11 },
      alignment: { vertical: 'middle', horizontal: 'left', wrapText: true }
    },
    {
      font: { name: 'Times New Roman', size: 11 },
      alignment: { vertical: 'middle', horizontal: 'center' }
    }
  ];

  headTableRender({ worksheet, rowIndex: 5, headers });

  dataTableRender({ worksheet, rowIndex: 5, headers, styles, data: records });

  rowsRender(worksheet, [
    {
      row: records.length + 6,
      mergeRange: 'A:C',
      value: 'Всього',
      font: { name: 'Times New Roman', size: 12 },
      alignment: { vertical: 'middle', horizontal: 'right' }
    },
    {
      row: records.length + 6,
      mergeRange: 'D:D',
      value: totalJobCount,
      font: { name: 'Times New Roman', size: 12 },
      alignment: { vertical: 'middle', horizontal: 'center' }
    }
  ]);

  return await workbook.xlsx.writeBuffer();
};
