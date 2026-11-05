// Throwaway QA helper (phase 02+): drives the real app over CDP, no manual clicking needed.
// Usage: node qa/cdp.mjs eval "<js>"  |  node qa/cdp.mjs screenshot out.png
// Connects to the Legion Electron instance started with --remote-debugging-port=9222.
import WebSocket from 'ws';
import fs from 'fs';

const port = process.env.CDP_PORT || 9223;

async function getTarget() {
  const res = await fetch(`http://127.0.0.1:${port}/json/list`);
  const list = await res.json();
  const page = list.find((t) => t.type === 'page' && !/devtools/.test(t.url));
  if (!page) throw new Error('no page target: ' + JSON.stringify(list.map((t) => t.url)));
  return page;
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    ws.on('open', () =>
      resolve({
        send: (method, params = {}) =>
          new Promise((res, rej) => {
            const mid = ++id;
            pending.set(mid, { res, rej });
            ws.send(JSON.stringify({ id: mid, method, params }));
          }),
        close: () => ws.close(),
      })
    );
    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id && pending.has(msg.id)) {
        const p = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result);
      }
    });
    ws.on('error', reject);
  });
}

const [,, cmd, arg] = process.argv;
const target = await getTarget();
const cdp = await connect(target.webSocketDebuggerUrl);
try {
  if (cmd === 'eval') {
    const r = await cdp.send('Runtime.evaluate', {
      expression: arg,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    console.log(JSON.stringify(r.result.value, null, 1));
  } else if (cmd === 'screenshot') {
    const r = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(arg, Buffer.from(r.data, 'base64'));
    console.log('saved', arg);
  } else {
    throw new Error('unknown cmd');
  }
} finally {
  cdp.close();
}
