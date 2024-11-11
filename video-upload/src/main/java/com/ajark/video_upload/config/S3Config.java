package com.ajark.video_upload.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class S3Config {

	@Value("${aws.accessKeyId}")
	private String accessKey;

	@Value("${aws.secretKey}")
	private String secretKey;

	@Value("${aws.region}")
	private String region;

	@Bean
	public AmazonS3 amazonS3() {
		BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
		return AmazonS3ClientBuilder.standard().withRegion(Regions.fromName(region))
				.withCredentials(new AWSStaticCredentialsProvider(awsCredentials)).build();
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // Allows all endpoints
						.allowedOrigins("http://localhost:5173") // Allow requests from frontend URL
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Add allowed methods
						.allowedHeaders("*").allowCredentials(true);
			}
		};
	}

}
