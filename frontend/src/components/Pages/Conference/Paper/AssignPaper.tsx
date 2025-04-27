import React, { useState } from "react";

interface Paper {
  title: string;
  abstract: string;
  keywords: string[];
  authors: string[];
  paperFile: File | null;
}

const AssignPaper: React.FC = () => {
  const [paper, setPaper] = useState<Paper>({
    title: "",
    abstract: "",
    keywords: [],
    authors: [],
    paperFile: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPaper((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(",").map((keyword) => keyword.trim());
    setPaper((prev) => ({
      ...prev,
      keywords,
    }));
  };

  const handleAuthorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const authors = e.target.value.split(",").map((author) => author.trim());
    setPaper((prev) => ({
      ...prev,
      authors,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files && e.target.files[0]) {
    //     setPaper((prev) => ({
    //         ...prev,
    //         paperFile: e.target.files[0],
    //     }));
    // }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", paper.title);
    formData.append("abstract", paper.abstract);
    formData.append("keywords", JSON.stringify(paper.keywords));
    formData.append("authors", JSON.stringify(paper.authors));
    if (paper.paperFile) {
      formData.append("paper", paper.paperFile);
    }

    // Replace with your API endpoint
    fetch("http://127.0.0.1:5000/paper/submit", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("Paper uploaded successfully!");
        } else {
          alert("Failed to upload paper.");
        }
      })
      .catch((error) => {
        console.error("Error uploading paper:", error);
        alert("An error occurred while uploading the paper.");
      });
  };

  return (
    <div>
      <h1>Assign Paper</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={paper.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Abstract:</label>
          <textarea
            name="abstract"
            value={paper.abstract}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Keywords (comma-separated):</label>
          <input
            type="text"
            value={paper.keywords.join(", ")}
            onChange={handleKeywordsChange}
          />
        </div>
        <div>
          <label>Authors (comma-separated):</label>
          <input
            type="text"
            value={paper.authors.join(", ")}
            onChange={handleAuthorsChange}
          />
        </div>
        <div>
          <label>Upload Paper (PDF):</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AssignPaper;
