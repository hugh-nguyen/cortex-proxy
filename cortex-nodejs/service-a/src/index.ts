// import 'cortex-nodejs/register';

import express, { Request, Response } from 'express';
import { setupAutoHeaderForwarding } from 'cortex-nodejs';
import axios from 'axios';
console.log('service-a route axios path:', require.resolve('axios'));

const app = express();

// Set up our auto header forwarding middleware (this applies your monkey-patch)
// (You can keep this if you want the global behavior too.)
setupAutoHeaderForwarding(app);

app.get('/a/getresult', async (req: Request, res: Response) => {
  const x = parseInt(req.query.x as string, 10);
  const y = parseInt(req.query.y as string, 10);
  if (Number.isNaN(x) || Number.isNaN(y)) {
    return res.status(400).json({ error: 'Missing x or y' });
  }

  // // Explicitly extract the inbound X-API-Version header
  // const apiVersion = req.header('X-API-Version');
  // console.log('Extracted X-API-Version from inbound request:', apiVersion);

  try {
  //   // Manually forward the header in the axios request to Envoy
  //   const response = await axios.get(`http://envoy:8080/b/getresult?x=${x}&y=${y}`, {
  //     headers: apiVersion ? { 'X-API-Version': apiVersion } : {}
  //   });

    console.log('About to call axios.get in service-a route');
    const response = await axios.get(`http://envoy:8080/b/getresult?x=${x}&y=${y}`);
    return res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error("Error calling /b/getresult:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log('service-a listening on port 5000');
});
