/// <reference lib="webworker" />

import type {
  WorkerRequest,
  WorkerResponse,
} from '../db-engine/types';

const ctx = self as unknown as WorkerScope;

ctx.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = e.data;

  const respond = (resp: WorkerResponse) => ctx.postMessage(resp);

  try {
    switch (type) {
      default:
        respond({ id, type: 'error', payload: `Unknown message type: ${type}` });
    }
  } catch (err) {
    respond({ id, type: 'error', payload: String(err) });
  }
};
