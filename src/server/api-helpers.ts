import { Request, Response } from 'express';

export function handleApi<T>(
  handler: (req: Request) => Promise<T>
) {
  return async (req: Request, res: Response) => {
    try {
      const data = await handler(req);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
