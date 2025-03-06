// SERVICE-A
import express, { Request, Response } from 'express';
import axios from 'axios';
import { instrumentWithAxon } from 'cortex-axon-js';

const app = express();

app.use(instrumentWithAxon);

axios.defaults.proxy = {
  host: 'envoy',
  port: 8080
};

app.get('/a/getresult', async (req: Request, res: Response) => {
  const x = parseInt(req.query.x as string, 10);
  const y = parseInt(req.query.y as string, 10);
  if (Number.isNaN(x) || Number.isNaN(y)) {
    return res.status(400).json({ error: 'Missing x or y' });
  }

  try {
    const response = await axios.get(`http://localhost/b/getresult?x=${x}&y=${y}`);
    return res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error("Error calling /b/getresult:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log('service-a listening on port 5000');
});
