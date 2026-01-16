exports.calculateATS = (resumeText, jdText) => {
  const resumeWords = resumeText.toLowerCase().match(/\b\w+\b/g) || [];
  const jdWords = jdText.toLowerCase().match(/\b\w+\b/g) || [];

  const matched = jdWords.filter(word => resumeWords.includes(word));

  const score = Math.min(
    100,
    Math.round((matched.length / jdWords.length) * 100)
  );

  return {
    score,
    matchedKeywords: [...new Set(matched)],
    missingKeywords: jdWords.filter(w => !resumeWords.includes(w))
  };
};
