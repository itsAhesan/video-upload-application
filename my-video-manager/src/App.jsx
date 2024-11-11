import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [uploadAbortController, setUploadAbortController] = useState(null);
  const [downloadAbortController, setDownloadAbortController] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/videos');
      console.log('Fetched videos:', response.data);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const controller = new AbortController();
    setUploadAbortController(controller);

    try {
      await axios.post('http://localhost:8080/api/videos/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
        signal: controller.signal,
      });
      setSelectedFile(null);
      setUploadProgress(0);
      fetchVideos();
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Upload canceled');
      } else {
        console.error('Error uploading file:', error);
      }
    }
  };

  const cancelUpload = () => {
    if (uploadAbortController) {
      uploadAbortController.abort();
      setUploadProgress(0);
      setUploadAbortController(null);
    }
  };

  const handleDownload = async (url) => {
    const controller = new AbortController();
    setDownloadAbortController(controller);

    try {
      const response = await axios.get(url, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setDownloadProgress(percent);
        },
        signal: controller.signal,
      });
      const fileName = url.split('/').pop();
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDownloadProgress(0);
      setDownloadAbortController(null);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Download canceled');
      } else {
        console.error('Error downloading file:', error);
      }
    }
  };

  const cancelDownload = () => {
    if (downloadAbortController) {
      downloadAbortController.abort();
      setDownloadProgress(0);
      setDownloadAbortController(null);
    }
  };

  const handleDelete = async (url) => {
    setDeleting(true);
    try {
      const fileName = url.split('/').pop();
      await axios.delete(`http://localhost:8080/api/videos/delete/${fileName}`);
      setDeleting(false);
      fetchVideos();
    } catch (error) {
      setDeleting(false);
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="App">
      <h1>Video Manager</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {uploadProgress > 0 && (
          <button onClick={cancelUpload}>Cancel Upload</button>
        )}
      </div>

      {uploadProgress > 0 && (
        <div>
          <p>Upload Progress: {uploadProgress}%</p>
          <progress value={uploadProgress} max="100" />
        </div>
      )}

      {downloadProgress > 0 && (
        <div>
          <p>Download Progress: {downloadProgress}%</p>
          <progress value={downloadProgress} max="100" />
          <button onClick={cancelDownload}>Cancel Download</button>
        </div>
      )}

      {deleting && <p>Deleting video...</p>}

      <h2>Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul>
          {videos.map((url, index) => {
            const fileName = url.split('/').pop();
            return (
              <li key={index}>
                <span>{fileName}</span>
                <button onClick={() => handleDownload(url)}>Download</button>
                <button onClick={() => handleDelete(url)}>Delete</button>
                {/* Video Player */}
                <video width="320" height="240" controls>
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default App;
