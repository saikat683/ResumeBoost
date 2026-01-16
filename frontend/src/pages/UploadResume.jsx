import { useState } from "react";
import axios from "../api/axios";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    console.log("FILES:", e.target.files); // DEBUG
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("FILE AT SUBMIT:", file); // DEBUG

    if (!file) {
      setError("Please select a resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await axios.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Uploaded successfully");
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />

      <button type="submit">Upload and Analyze</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}


