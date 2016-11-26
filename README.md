# Summary

This project has the goal to test the [webtask.io](https://webtask.io) project by creating a system which will do the following:  

1. Connect to YouTube
2. Perform a search
3. Generate a HTML of the 5 itens in the search
4. Upload and store this file in a S3 Bucket

## Requirements

In order to this project to run, you will need:

- A Google Account with the Developer console activated
  - You should create a project and active the YouTube Data API
  - You need a **API KEY** credential
- A AWS Account
  - Create a IAM user with a policy that gives **write** access to S3
  - You will need the **ACCESS KEY** and the **SECRET KEY** of the IAM user
- A S3 Bucket
  - You should create a S3 bucket in your AWS Console

### Using the project

In both versions of the project, a set of default secret params are expected so the system could run. Those params are:

- GOOGLE_API
  - Google API KEY credential that you will get from the developer console
- AWS_KEY
  - ACCESS KEY mentioned earlier of the IAM user
- AWS_SECRET
  - SECRET KEY mentioned earlier of the IAM user
- S3_BUCKET
  - Name of the bucket that you created in S3
- AWS_REGION
  - Identifier of the region where you created the bucket
- YT_TERM
  - Default search term for the YouTube search

#### Webtask.io version

For this version you will notice the ```webtask.js``` file, that you need to run.


All the parameters commented above should be passed to the application as secret params, as in the example below:

```bash
wt create --secret GOOGLE_API="SAMPLE" --secret AWS_KEY="SAMPLE" --secret AWS_SECRET="SAMPLE" --secret S3_BUCKET="SAMPLE" --secret YT_TERM="surfboards" --secret AWS_REGION="us-east-1" webtask.js
```

After this, when you access the URL provided by the wt-cli, you will notice that a new file will be created inside your S3 bucket.

##### Custom search

You can override the custom **YT_TERM** by providing a **GET** parameter for the webtask by adding in the url ```?search=[desired search]```
