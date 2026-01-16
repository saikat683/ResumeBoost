import { useState } from "react";
import axios from "axios";


const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    console.log("FILES:", e.target.files);
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("FILE AT SUBMIT:", file);

    if (!file) {
      setError("Please select a resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file); // MUST match backend
    // formData.append("jobDescription", "dummy jd"); // optional

    try {
      await axios.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Resume uploaded successfully");
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Upload Resume</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <br /><br />

        <button type="submit">Upload and Analyze</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default ResumeUploadPage;
