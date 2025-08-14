export class EntityNotFoundException extends Error {
  code = 'ENTITY_NOT_FOUND';

  constructor(message?: string) {
    super(message ?? 'Entity not found');
  }
}
