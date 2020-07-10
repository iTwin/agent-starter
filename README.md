# iModel.js "Starter Agent"

## About this Repository

This repository is a quick way to skip the boilerplate and get started writing an iModel.js Agent.  
Simply clone, `npm install`, setup your config, and you're ready to go!

## Configuration

The provided agent app _almost_ works right out of the box, but you'll need to configure it with your project, iModel, and OIDC information.
To do this, just create a `.env` file at the project root with the following:

```ini
###############################################################################
# This file contains secrets - don't commit or share it!
###############################################################################

# Specify an iModel
CONTEXT_ID=
IMODEL_ID=

# OIDC configuration
#   Don't forget to add <CLIENT_ID>@apps.imsoidc.bentley.com to your CONNECT project too!
CLIENT_ID=
CLIENT_SECRET=
```

Your `CLIENT_ID` and `CLIENT_SECRET` should both come from the iModel.js [registration dashboard](https://www.imodeljs.org/getting-started/registration-dashboard/) - be sure to create an "Agent" app!

## Building and running your agent

Once you've created your .env file, you can build your agent via `npm run build`.

Or - even better - start TypeScript in watch/incremental rebuild mode: `npm run build -- --watch`

### Running agent locally

To run your agent, you can simply do `npm start` (or `node .` if you're in the project root dir).  This will continuously poll for new changesets pushed to the iModelHub.

For testing, it can often also be useful to skip the event listening and just run against a specific changeset.  To do that, either run `npm start -- --latest` to use the latest changeset, or `npm start -- --changeset=<CHANGESETID>` to use any specific changeset.

## Next Steps

The entry point of for both single-changeset test runs and handling individual iModelHub change events is the `MyAgent.run()` method. There you can implement your agent's behavior after the iModel is downloaded.
