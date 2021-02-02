# clicks-tracker-api

## The Challenge

Build a link tracking backend API which does the following:

1. When a user clicks a link it should trigger an HTTPS request to an API Gateway or AppSync endpoint

2. Behind the API Gateway or AppSync endpoint should be a Lambda function to process the event

3. The Lambda function should record this event into a database like AWS DynamoDB

4. The Lambda should then return a JSON response after saving the event in the database

## Requirements

All AWS Infrastructure needs to be automated with IAC using Serverless Framework and CloudFormation as needed

## Setup

This project is divided into 2 monorepos, one for the resources ([found here](https://github.com/Tee88/clicks-tracker-resources)) and one for the services themselves (this repo). To get the project up and running do the following:

- [Install](https://www.serverless.com/framework/docs/getting-started/) the Serverless framework
- Make sure you have configured a `default` AWS profile on you local machine using the Serverless Framework CLI tool using this command `serverless config credentials --provider aws --key <Access Key ID> --secret <Secret Access Key>` or using the AWS CLI tool by running this command `aws configure`
- Clone and deploy the resources monorepo using `sls deploy`
- Clone and deploy the api monorepo (this repo) using `sls deploy`

## Environments

The IAC was designed to be dynamically deployed to different stages.

- Running `sls deploy` will deploy to the `predev` stage which utilizes the `default` AWS profile.
- (optional) Running `sls deploy -s dev` will deploy to the `dev` stage which utilizes the `clicks-tracker-dev` AWS profile.
- (optional) Running `sls deploy -s staging` will deploy to the `staging` stage which utilizes the `clicks-tracker-staging` AWS profile.
- (optional) Running `sls deploy -s prod` will deploy to the `prod` stage which utilizes the `clicks-tracker-prod` AWS profile.

This structure also helps with CI/CD, where you can link your git branches `dev`, `main` and `prod` to your `dev` `staging` and `prod` AWS account respectively. Where making a PR on any of these branch will trigger a build in the respective stage.

## How the Link Tracker works

The link/click Tracker MVP is based on 3 main AWS services, APIGW, Lambda and DynamoDB.
The API has one endpoint `<API ROOT>/trackLink/{proxy+}` . The Frontend developer will use this endpoint on the client site and pass in the URL they desire to track like this `<API ROOT>/trackLink/https://www.serverlessguru.com/blog/10-big-serverless-re-invent-2020-announcements` . Whenever the end user clicks on the (for example a blog post link) a request `GET` will go through APIGW to the Lambda which will handle the event and redirect the user to actual blog post using a `302 FOUND` response.
Even though most Link Trackers usually have a dedicated endpoint to generate a "trackable link", I decided to go the minimal path where we have a single endpoint that accepts any URL we want to track.

I used `302 FOUND` instead of `301 MOVED PERMANENTLY` because `301` response is cacheable by default, which prevent the request from reaching our endpoint to capture the click event.

## Assumptions

- Only Valid URLs will be submitted for tracking.
- All requests are human generated (not automated) for accurate tracking results.

## Database Modeling

In order to come up with a reasonable data model in DynamoDB I had to set a couple basic access patterns:

1.  Get total count of clicks by URL
2.  List all click events (ip, browser, timestamp, os,...etc) on a URL by IP address.
3.  List all click events by URL
4.  Get total clicks on URL by a specific IP address
5.  List all URLs clicked by IP address (used Global secondary Index)

I used the [AWS NoSQL Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html) for modeling and visualizing the data before approving the model. Following are some image exports from the tool.

![TrackedLinks](https://user-images.githubusercontent.com/23310971/106546005-0bddea00-64d0-11eb-8473-66ea81b129a1.png)

![GSI_TrackedLinks_ipAddress](https://user-images.githubusercontent.com/23310971/106546120-36c83e00-64d0-11eb-9c90-48b57164fcfb.png)

## Limitations

- Can't query by time range.
- PK max length is 2048 bytes which might limit the length of the URL (URL shortener for the rescue)
- PK Max size is 10GB which might limit the number of events we can store per URL.
- It is just an MVP :p

## Stack and Tools

- Lambda
- APIGW
- DynamoDB
- Serverless Framework + CloudFormation
- X-Ray
- Webpack
- Commitizen (for conventional commit messages)
- NoSQL Workbench
- Seed.run (for CI/CD)

## Future work

### Features

- Support querying by time range.
- Extract client location from IP.
- Create a "generate trackable link" endpoint so the marketing people can attach more meta to the generated URL (campaign name, tags, other meta...)

### codebase

- Add integration tests and unit tests.
- Create an AWS ORG with dedicated accounts for each stage
- Redirect user to requested link before handling the event for better UX (using SNS or StepFunctions)
