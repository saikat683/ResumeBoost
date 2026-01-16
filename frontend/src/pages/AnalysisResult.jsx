const AnalysisResult = ({ data }) => (
  <div>
    <h2>ATS Score: {data.atsScore}%</h2>
    <p>Missing Skills:</p>
    <ul>
      {data.missingKeywords.map(k => <li key={k}>{k}</li>)}
    </ul>
    <p>AI Feedback:</p>
    <pre>{data.aiFeedback}</pre>
  </div>
);
