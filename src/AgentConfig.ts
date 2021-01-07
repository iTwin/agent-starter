import { assert } from "@bentley/bentleyjs-core";
import * as dotenv from "dotenv";

export function loadAgentConfig() {
  // Load environment variables from .env file
  const result = dotenv.config();
  if (result.error)
    throw result.error;

  assert(!!process.env.IMJS_CONTEXT_ID, `Missing required env var: "IMJS_CONTEXT_ID"`);
  assert(!!process.env.IMJS_IMODEL_ID, `Missing required env var: "IMJS_IMODEL_ID"`);
  assert(!!process.env.CLIENT_ID, `Missing required env var: "CLIENT_ID"`);
  assert(!!process.env.CLIENT_SECRET, `Missing required env var: "CLIENT_SECRET"`);

  return {
    IMJS_CONTEXT_ID: process.env.IMJS_CONTEXT_ID,
    IMJS_IMODEL_ID: process.env.IMJS_IMODEL_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
  };
}

export type AgentConfig = ReturnType<typeof loadAgentConfig>;
