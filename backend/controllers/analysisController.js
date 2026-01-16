const { extractTextFromPDF } = require("../utils/pdfParser");
const { calculateATS } = require("../utils/atsScorer");
const { analyzeWithGemini } = require("../utils/geminiHelper");
const Resume = require("../models/Resume");

exports.analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ msg: "No resume uploaded" });

    const resumeText = await extractTextFromPDF(file.buffer);

    const atsResult = calculateATS(resumeText, jobDescription);

    const aiFeedback = await analyzeWithGemini(resumeText, jobDescription);

    const saved = await Resume.create({
      user: req.user.id,
      resumeText,
      atsScore: atsResult.score,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      aiFeedback
    });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ msg: "Analysis failed" });
  }
};
