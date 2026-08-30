import type { WorkerRequest, WorkerResponse } from './types';

let worker: Worker | null = null;
let messageQueue: Map<string, {
  resolve: (value: WorkerResponse) => void;
  reject: (reason: unknown) => void;
}> = new Map();
let messageCounter = 0;

export function initWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('../workers/sql.worker.ts', import.meta.url));
  worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
    const { id } = e.data;
    const entry = messageQueue.get(id);
    if (entry) {
      messageQueue.delete(id);
      entry.resolve(e.data);
    }
  };
  worker.onerror = (e) => {
    console.error('sql-worker error:', e);
  };
  return worker;
}

export function sendMessage(type: WorkerRequest['type'], payload: unknown): Promise<WorkerResponse> {
  if (!worker) initWorker();
  const id = `msg-${++messageCounter}`;
  return new Promise((resolve, reject) => {
    messageQueue.set(id, { resolve, reject });
    worker!.postMessage({ id, type, payload } satisfies WorkerRequest);
  });
}

export function terminateWorker(): void {
  if (worker) {
    worker.terminate();
    worker = null;
    messageQueue.clear();
  }
}
