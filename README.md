# iTwin.js "Starter Agent"

## About this Repository

This repository is a quick way to skip the boilerplate and get started writing an iTwin.js Agent.
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
#   Don't forget to add <CLIENT_ID>@apps.imsoidc.bentley.com to your Project too!
CLIENT_ID=
CLIENT_SECRET=

imjs_itwin_platform_authority=https://ims.bentley.com
```

The `CLIENT_ID` and `CLIENT_SECRET` can be obtained by registering an app from the [iTwin Platform Portal](https://developer.bentley.com/register/) - be sure to create a "Service" app and add the "Visualization" API!

## Building and running your agent

Once you've created your .env file, you can build your agent via `npm run build`.

Or - even better - start TypeScript in watch/incremental rebuild mode: `npm run build -- --watch`

### Running agent locally

To run your agent, you can simply do `npm start` (or `node .` if you're in the project root dir).  This will continuously poll for new changesets pushed to the iModelHub.

Once the agent is listening for changesets, you can use the [iTwin Synchronizer](https://www.bentley.com/en/products/product-line/digital-twins/itwin-synchronizer) to synchronize a change.

For testing, it can often also be useful to skip the event listening and just run against a specific changeset.  To do that, either run `npm start -- --latest` to use the latest changeset, or `npm start -- --changeset=<CHANGESETID>` to use any specific changeset.

## Next Steps

The entry point of for both single-changeset test runs and handling individual iModelHub change events is the `MyAgent.run()` method. There you can implement your agent's behavior after the iModel is downloaded.
