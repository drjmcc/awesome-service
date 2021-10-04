export interface ResponseContext<T> {
  response?: T | null;

  validationErrors?: string[] | null;
}
