// SERVICE-B 0.0.1
import express, { Request, Response } from 'express';

const app = express();

app.get('/b/getresult', (req: Request, res: Response) => {
  const x = parseInt(req.query.x as string, 10);
  const y = parseInt(req.query.y as string, 10);
  if (Number.isNaN(x) || Number.isNaN(y)) {
    return res.status(400).json({ error: 'Missing x or y' });
  }
  res.json({ result: x + y });
});

app.listen(5001, () => {
  console.log('service-b-0-0-1 on port 5001');
});
