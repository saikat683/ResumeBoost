const pdfParse = require("pdf-parse");

exports.extractTextFromPDF = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};
