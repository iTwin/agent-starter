import { AgentAuthorizationClient, AzureFileHandler } from "@bentley/backend-itwin-client";
import { ChangeSetPostPushEvent, EventSubscription, IModelHubClient, IModelHubEventType } from "@bentley/imodelhub-client";
import { AuthorizedBackendRequestContext, BriefcaseDb, BriefcaseManager, IModelHost, IModelHostConfiguration, IModelJsNative } from "@bentley/imodeljs-backend";
import { IModelVersion } from "@bentley/imodeljs-common";
import { AgentConfig } from "./AgentConfig";

export class MyAgent {
  private readonly config: AgentConfig;
  private readonly hubClient: IModelHubClient;
  private readonly oidcClient: AgentAuthorizationClient;

  private hubSubscription?: EventSubscription;
  private deleteEventListener?: () => void;

  constructor(config: AgentConfig) {
    this.config = config;
    this.hubClient = new IModelHubClient(new AzureFileHandler());
    this.oidcClient = new AgentAuthorizationClient({
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      scope: "itwinjs",
    });
  }

  public async initialize() {
    const hostConfig = new IModelHostConfiguration();
    hostConfig.applicationType = IModelJsNative.ApplicationType.WebAgent;
    hostConfig.imodelClient = this.hubClient;
    await IModelHost.startup(hostConfig);
  }

  public async listen() {
    const ctx = await this.createContext();

    // Create iModelHub event subscription
    const eventTypes = [
      IModelHubEventType.ChangeSetPostPushEvent,
    ];
    this.hubSubscription = await this.hubClient.events.subscriptions.create(ctx, this.config.IMODEL_ID, eventTypes);
    console.log(`Event subscription "${this.hubSubscription.wsgId}" created in iModelHub.`);

    // Define event listener
    const listener = async (event: ChangeSetPostPushEvent) => {
      try {
        console.log(`Received notification that changeset "${event.changeSetId} was just posted to the Hub`);
        await this.run(IModelVersion.asOfChangeSet(event.changeSetId));
      } catch (error) {
        console.error(error);
        console.error("Failed to handle changeset event", event);
      }
    };

    // Start listening to events
    const authCallback = () => this.oidcClient.getAccessToken();
    this.deleteEventListener = this.hubClient.events.createListener(ctx, authCallback, this.hubSubscription.wsgId, this.config.IMODEL_ID, listener);
  }

  public async run(version = IModelVersion.latest()) {
    const ctx = await this.createContext();

    // Download iModel
    const briefcaseProps = await BriefcaseManager.downloadBriefcase(ctx, { contextId: this.config.CONTEXT_ID, iModelId: this.config.IMODEL_ID, asOf: version.toJSON() });
    ctx.enter();

    // Open iModel
    const iModel = await BriefcaseDb.open(ctx, { fileName: briefcaseProps.fileName, readonly: false });
    ctx.enter();

    // TODO....
    console.log(iModel.rootSubject.name);

    // Close iModel
    iModel.close();
  }

  private async createContext() {
    const token = await this.oidcClient.getAccessToken();
    const ctx = new AuthorizedBackendRequestContext(token);
    ctx.enter();
    return ctx;
  }

  public async terminate() {
    if (this.deleteEventListener) {
      this.deleteEventListener();
      this.deleteEventListener = undefined;
    }

    if (this.hubSubscription) {
      await this.hubClient.events.subscriptions.delete(await this.createContext(), this.config.IMODEL_ID, this.hubSubscription.wsgId);
      console.log(`Event subscription "${this.hubSubscription.wsgId}" deleted in iModelHub.`);
      this.hubSubscription = undefined;
    }

    await IModelHost.shutdown();
  }
}
