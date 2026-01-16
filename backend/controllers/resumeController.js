// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const { analyzeResumeWithGeminiFlash,compareResumeWithJD } = require("../utils/geminiHelper");
// const Resume = require("../models/Resume");
// const { extractTextFromPDF } = require("../utils/pdfUtils");


// exports.uploadResumePDF = async (req, res) => {
//   const file = req.file;
//   const { title, userId } = req.body;
//   // const filePath = `/uploads/${file.filename}`;

//   if (!file) return res.status(400).json({ msg: "No file uploaded" });

//   try {
//     // const dataBuffer = fs.readFileSync(file.path);
//     //  const resumeText = await  pdfParse(dataBuffer);
//      const uint8Array = new Uint8Array(file.buffer);
    
//     const pdfData = await pdfParse(uint8Array);
//     const resumeText = pdfData.text;
//       const matchReport = await analyzeResumeWithGeminiFlash (resumeText);

//     // const analysis = await analyzeResumeWithGeminiFlash(resumeText);

//     const newResume = await Resume.create({
//       user: userId,
//       title: title || file.originalname,
//       resumeText,
      
//       fileData: file.buffer, // store actual file in MongoDB
//       contentType: file.mimetype,
//       matchReport: JSON.stringify(matchReport),
//     });
//     console.log("Uploaded file:", req.file?.path);
//     console.log("✅ Gemini matchReport before saving:", matchReport);

//     // fs.unlinkSync(file.path); // delete file after parsing
//     res.status(201).json(newResume);
//   } catch (err) {
//     console.error("Upload Error:", err.message);
//     res.status(500).json({ msg: "Failed to analyze PDF" });
//   }
// };

// exports.getUserResumes = async (req, res) => {
//   const userId = req.user.id;

//   const resumes = await Resume.find({ user: userId }).populate("matches");
//   res.status(200).json(resumes);
// };

// exports.compareMultipleResumes = async (req, res) => {
//   const { jobDescription, resumeIds } = req.body;

//   if (!jobDescription || !Array.isArray(resumeIds) || resumeIds.length === 0) {
//     return res.status(400).json({ msg: "Invalid input data." });
//   }

//   try {
//     const results = [];

//     for (const id of resumeIds) {
//       const resume = await Resume.findById(id);
//       if (!resume) continue;

//       const report = await compareResumeWithJD(resume.resumeText, jobDescription);

//       results.push({
//         resumeId: resume._id,
//         resumeTitle: resume.title,
//         matchReport: report,
//       });
//     }

//     res.status(200).json(results);
//   } catch (err) {
//     console.error("❌ compareMultipleResumes Error:", err.message);
//     res.status(500).json({ msg: "Resume comparison failed." });
//   }
// };

// // controllers/resumeController.js
// exports.checkATSScore = async (req, res) => {
//   try {
//     const { resumeText, jobDescription } = req.body;

//     // 1. Extract keywords from JD
//     const jdKeywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];

//     // 2. Extract keywords from resume
//     const resumeWords = resumeText.toLowerCase().match(/\b\w+\b/g) || [];

//     // 3. Calculate keyword match score
//     const matchedKeywords = jdKeywords.filter(word => resumeWords.includes(word));
//     const keywordScore = (matchedKeywords.length / jdKeywords.length) * 50; // 50% weight

//     // 4. Format & section check
//     const sections = ["education", "experience", "skills", "projects", "contact"];
//     const sectionScore =
//       (sections.filter(section => resumeText.toLowerCase().includes(section)).length /
//         sections.length) *
//       30; // 30% weight

//     // 5. Basic formatting check (no tables/images etc.)
//     const formatScore = 20; // Assume perfect for now

//     const atsScore = Math.round(keywordScore + sectionScore + formatScore);

//     res.json({
//       score: atsScore,
//       matchedKeywords: [...new Set(matchedKeywords)],
//       missingKeywords: jdKeywords.filter(word => !resumeWords.includes(word)),
//       suggestions: [
//         "Add missing keywords to your experience section.",
//         "Ensure proper section headings.",
//         "Avoid images, tables, and complex formatting."
//       ]
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to check ATS score" });
//   }
// };


// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const { analyzeResumeWithGeminiFlash } = require("../utils/geminiHelper");
// const Resume = require("../models/Resume");
// const { extractTextFromPDF } = require("../utils/pdfUtils");


// exports.uploadResumePDF = async (req, res) => {
//   const file = req.file;
//   const { title, userId } = req.body;
//   const filePath = `/uploads/${file.filename}`;

//   if (!file) return res.status(400).json({ msg: "No file uploaded" });

//   try {
//     const dataBuffer = fs.readFileSync(file.path);
//     const pdfData = await pdfParse(dataBuffer);
//     const resumeText = pdfData.text; // ✅ Extracted here

//     const matchReport = await analyzeResumeWithGeminiFlash(resumeText); // or your Gemini function

//     const newResume = await Resume.create({
//       user: userId,
//       title: title || file.originalname,
//       resumeText,
//       fileUrl: filePath,
//       matchReport: JSON.stringify(matchReport),
//     });

//     console.log("Uploaded file:", req.file?.path);
//     res.status(201).json(newResume);
//   } catch (err) {
//     console.error("Upload Error:", err.message);
//     res.status(500).json({ msg: "Failed to analyze PDF" });
//   }
// };




const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const { analyzeResumeWithGeminiFlash } = require("../utils/geminiHelper");

exports.uploadResumePDF = async (req, res) => {
  try {
    console.log("➡️ Upload API hit");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📄 File name:", req.file.originalname);

    // ✅ THIS WAS FAILING BEFORE
    const pdfData = await pdfParse(req.file.buffer);

    console.log("📝 Extracted text length:", pdfData.text.length);

    const matchReport = await analyzeResumeWithGeminiFlash(pdfData.text);

    console.log("🤖 Gemini matchReport:", matchReport);

    res.status(200).json({ matchReport });

  } catch (err) {
    console.error("❌ Resume analysis error:", err);
    res.status(500).json({ message: "Resume analysis failed" });
  }
};


