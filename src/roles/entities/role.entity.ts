import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: Number })
  authority: number;
  @ApiProperty({ type: Date })
  createdAt: Date;
  @ApiProperty({ type: Date, nullable: true })
  updatedAt: Date | null;
}
