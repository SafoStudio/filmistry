export class TmdbConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TmdbConfigError';
  }
}

export class TmdbRequestError extends Error {
  constructor(
    public readonly status: number,
    message?: string
  ) {
    super(message ?? `TMDB request failed with status ${status}`);
    this.name = 'TmdbRequestError';
  }
}
