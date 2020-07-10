# @bentley/my-agent

Copyright © Bentley Systems, Inc. 2020

## About this Repository

This repository contains source code for the my-agent.

## Build Instructions

1. Clone repository (first time) with `git clone` or pull updates to the repository (subsequent times) with `git pull`. It is possible this repo was generated with yeoman.
2. Install dependencies: `npm install`
3. Clean: `npm run clean`
4. Build source: `npm run build`
5. Provide missing values to your .env file (NOTE: THIS FILE SHOULD NOT BE COMMITTED).

## Running @bentley/my-agent

Running agent locally:

`npm run start`

## Logging

my-agent Agent logs events using SEQ. To use logging it is needed to provide `SEQ_KEY` in .env file. To get custom dev-seq key: https://docs.datalust.co/docs/api-keys (Don't forget to add an applied property of `Application`, so it is possible to query logs in dev-seq.bentley.com).

## Next Steps

The entry point of agent is MyAgent.run() method. There you can implement your agent's behavior after the iModel is downloaded.

## Pipelines

Azure variable group is required in order to run agent's pipeline. By default, agent requires variable groups called "my-agent - ENV (REGION)". For example sample-agent - QA UKS. You can change the name of required variable group in agent-azure-pipelines.yaml file.

To create Azure variable group, go to Pipelines -> Library.

Required variables are:
* AGENT_CLIENT_ID
* AGENT_CLIENT_SECRET (secret)

You can also add optional variables which are required for logging:
* SEQ_KEY (secret)
* SEQ_PORT
* SEQ_URL
* CRASH_REPORT_DIR