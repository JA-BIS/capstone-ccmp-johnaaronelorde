# Serverless Image Processing Pipeline

## Architecture Diagram  
![Architecture Diagram](path-to-your-architecture-image.png)  
*Visual representation of the pipeline showing AWS Lambda, S3 buckets, Step Functions, and API Gateway.*

---

## Prerequisites  
- AWS Account with required IAM permissions to create/manage Lambda, S3, Step Functions, API Gateway, and IAM roles  
- Node.js runtime with `sharp` library (or Python with Pillow) for image resizing in Lambda  
- AWS CLI installed and configured (optional)  

---

## Deployment Instructions

### Step 1: Create S3 Buckets  
- Create two S3 buckets with unique names:  
  - **Original images bucket**: stores uploaded raw images  
  - **Resized images bucket**: stores resized images after processing  

### Step 2: Deploy Lambda Function  
- Develop your Lambda function to:  
  - Retrieve images from the original S3 bucket  
  - Resize images using `sharp` or Pillow  
  - Upload resized images to the resized bucket  
- Package and deploy the Lambda function  
- Attach an IAM execution role with permissions to access your S3 buckets and CloudWatch logs  

### Step 3: Create Step Functions State Machine  
- Define a state machine with:  
  - Tasks to invoke the Lambda function  
  - Choice state for success/failure checks  
  - Success and failure terminal states  
- Obtain the state machine ARN  

### Step 4: Setup API Gateway  
- Create a REST API with a POST method (e.g., `/start-resize`)  
- Configure integration with AWS Service: Step Functions → StartExecution  
- Assign an IAM execution role with `states:StartExecution` permission on your state machine  
- Add mapping template to pass input payload and state machine ARN to Step Functions  
- Deploy the API to a stage and note the invoke URL  

### Step 5: Test Your Application  
- Use Postman or similar to send a POST request to API Gateway endpoint with JSON body:  
