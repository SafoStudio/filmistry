export default async (req, res) => {
  const { reqHandler } = await import('../dist/filmistry/server/server.mjs');
  return reqHandler(req, res);
};
