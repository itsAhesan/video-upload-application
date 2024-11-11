package com.ajark.video_upload.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

	@Autowired
	private AmazonS3 amazonS3;

	@Value("${aws.s3.bucketName}")
	private String bucketName;

	// Upload video to S3
	@PostMapping("/upload")
	public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
		String fileName = file.getOriginalFilename();
		try {
			amazonS3.putObject(new PutObjectRequest(bucketName, fileName, file.getInputStream(), new ObjectMetadata()));
			String fileUrl = amazonS3.getUrl(bucketName, fileName).toString();
			return ResponseEntity.ok(fileUrl);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error uploading video: " + e.getMessage());
		}
	}

	// view List all videos
	@GetMapping
	public ResponseEntity<List<String>> getVideos() {
		ListObjectsV2Result result = amazonS3.listObjectsV2(bucketName);
		List<String> videoUrls = result.getObjectSummaries().stream()
				.map(s -> amazonS3.getUrl(bucketName, s.getKey()).toString()).collect(Collectors.toList());
		return ResponseEntity.ok(videoUrls);
	}

	// View (download) a specific video
	@GetMapping("/download/{fileName}")
	public ResponseEntity<String> viewVideo(@PathVariable String fileName) {
		if (amazonS3.doesObjectExist(bucketName, fileName)) {
			String fileUrl = amazonS3.getUrl(bucketName, fileName).toString();
			return ResponseEntity.ok(fileUrl);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found");
		}
	}

	// Delete a specific video
	@DeleteMapping("/delete/{fileName}")
	public ResponseEntity<String> deleteVideo(@PathVariable String fileName) {
		try {
			amazonS3.deleteObject(bucketName, fileName);
			return ResponseEntity.ok("Video deleted successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error deleting video: " + e.getMessage());
		}
	}
}
