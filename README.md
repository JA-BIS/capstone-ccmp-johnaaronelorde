# Serverless Image Processing Pipeline

## Architecture Diagram  
<img width="601" height="571" alt="image" src="https://github.com/user-attachments/assets/9ca41328-d90f-4dfa-ab71-3616ff29c6a9" />


---

## Prerequisites  
- AWS account with permissions for Lambda, S3, Step Functions, API Gateway, and IAM  
- Node.js Lambda function using `sharp` for image resizing  
- AWS CLI (optional)  

---

## Deployment Instructions

### Step 1: Create S3 Buckets  
- Create the following buckets:  
  - Original images bucket: `capstone-original-imgs`  
  - Resized images bucket: `capstone-resized-img`  

### Step 2: Deploy Lambda Function  
- Package and deploy the Lambda function named:  
  `Capstone-imageResizer-Elorde`  
- Ensure the Lambda execution role has permissions for:  
  - `s3:GetObject` and `s3:PutObject` on the buckets above  
  - CloudWatch Logs access  

### Step 3: Create Step Functions State Machine  
- Deploy a Step Functions state machine named:  
  `Capstone-ImageProcessing-Workflow`  
- ARN:  
  `arn:aws:states:us-east-2:214181534712:stateMachine:Capstone-ImageProcessing-Workflow`  
- Define states to invoke the Lambda, check status, and handle success/failure  

### Step 4: Setup API Gateway  
- Create an API Gateway REST API endpoint with path like `/start-resize`  
- Integration: AWS Service → Step Functions  
  - AWS Region: `us-east-2`  
  - HTTP method: POST  
  - Action: `StartExecution`  
- Use execution role with permission policy allowing `states:StartExecution` on your state machine  
- Set integration mapping template to pass input and state machine ARN  

### Step 5: Test Your Application

1. Upload a test image (e.g., `sample-image.jpg`) to `capstone-original-imgs` bucket.  
2. Use Postman or curl to send a POST request to your API Gateway endpoint:  
