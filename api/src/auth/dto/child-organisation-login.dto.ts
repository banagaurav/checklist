import { ApiProperty } from '@nestjs/swagger';

export class ChildOrganisationLoginDto {
  @ApiProperty()
  childOrdId: number | null;
}
