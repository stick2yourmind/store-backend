export abstract class EntityDtoMapper<Entity, Dto> {
  abstract mapEntityToDto(entity: Entity): Dto;

  mapEntitiesToDto(entities: Entity[]): Dto[] {
    return entities.map((e) => {
      return this.mapEntityToDto(e);
    });
  }
}
