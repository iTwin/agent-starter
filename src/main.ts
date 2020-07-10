import { Logger, LogLevel } from "@bentley/bentleyjs-core";
import { IModelVersion } from "@bentley/imodeljs-common";
import * as minimist from "minimist";
import { onAnyKey } from "onAnyKey";
import { loadAgentConfig } from "./AgentConfig";
import { MyAgent } from "./MyAgent";

const argv = minimist(process.argv.slice(2));

Logger.initializeToConsole();
Logger.setLevelDefault(LogLevel.Error);

console.log("MY AGENT STARTED");

(async () => {
  try {
    const config = loadAgentConfig();
    const agent = new MyAgent(config);
    await agent.initialize();

    if (argv.latest) {
      await agent.run();
    } else if (argv.changeset) {
      await agent.run(IModelVersion.asOfChangeSet(argv.changeset));
    } else {
      await agent.listen();
      console.log("MY AGENT NOW LISTENING FOR HUB EVENTS -- press any key to stop");
      await onAnyKey();
    }

    await agent.terminate();
    console.log("MY AGENT FINISHED");
  } catch (error) {
    console.error(error, "Unhandled exception thrown in my-agent");
    process.exitCode = 1;
  }
})();

process.on("unhandledRejection", (_reason, promise) => {
  console.error("Unhandled promise rejection at:", promise);
  process.exitCode = 1;
});
