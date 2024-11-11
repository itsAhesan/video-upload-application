// api.js
const API_URL = "http://localhost:8080/api/videos"; // Replace with your actual API URL

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) throw new Error("Upload failed");
  const data = await response.json();
  return data;  // Expecting { fileName: 'filename.mp4' }
};

export const getVideo = async (fileName) => {
  const response = await fetch(`${API_URL}/download/${fileName}`);
  if (!response.ok) throw new Error("View failed");
  return await response.text();  // Returns URL of the video
};

// export const downloadVideo = async (fileName) => {
//   const response = await fetch(`${API_URL}/download/${fileName}`);

//   console.log("==================",response.json());
//   if (!response.ok) throw new Error("Download failed");
//   const blob = await response.blob();
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = fileName;
//   a.click();
//   window.URL.revokeObjectURL(url);
// };

export const deleteVideo = async (fileName) => {
  const response = await fetch(`${API_URL}/delete/${fileName}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Delete failed");
};
