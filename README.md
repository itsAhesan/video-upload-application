Project Documentation: Video Manager Application
1. Project Overview

- Description: This application allows users to upload, download, view, and delete videos, integrating with AWS S3 for storage. It includes a progress bar for upload and download operations.
- Technology Stack:
  - Backend: Spring Boot, AWS S3, Java
  - Frontend: React, Axios, Bootstrap (for progress bars)

2. System Requirements

- Backend:
  - Java 17
  - Spring Boot 3.3.5
  - AWS S3 bucket with appropriate permissions
- Frontend:
  - Node.js 18+
  - NPM (Node Package Manager)
  - Vite for React setup
  - Axios and Bootstrap libraries

3. Installation and Setup

- Backend (Spring Boot) Setup:
  1. Clone the backend repository.
  2. Set up AWS credentials and S3 bucket configuration in the application’s properties file.
  3. Build and run the Spring Boot application:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```

- Frontend (React) Setup:
  1. Clone the frontend repository.
  2. Install dependencies:
     ```bash
     npm install
     ```
  3. Start the development server:
     ```bash
     npm run dev
     ```

4. API Endpoints

- Upload Video: POST /api/videos/upload
  - Accepts: Video file in form data
- Download Video: GET /api/videos/download/{fileName}
- Delete Video: DELETE /api/videos/delete/{fileName}

5. Frontend Components

- VideoUpload.jsx: Main component handling file selection, upload, view, download, and delete functionality.
- Progress Bars:
  - Displays upload progress when uploading a file.
  - Displays download progress when downloading a file.

6. Usage Guide

- Upload a Video:
  1. Select a video file from your device.
  2. Click "Upload" to upload the video to AWS S3. A progress bar displays the upload progress.
- Download Video:
  - Click "Download Video" to download the video file to your device. A progress bar shows the download progress.
- Delete Video:
  - Click "Delete Video" to remove the file from S3 storage.

7. AWS S3 Permissions

- Configure your S3 bucket permissions to allow public access for file downloads.

8. Troubleshooting

- Upload Issues:
  - Ensure AWS credentials and bucket configurations are correctly set in the application properties.
- Download/View/Delete Issues:
  - Verify bucket permissions and CORS settings on AWS.

9. Future Enhancements

- Adding thumbnail previews for uploaded videos.
- Supporting bulk upload and download functionality.
- Deploy frontend and backend both for global access

