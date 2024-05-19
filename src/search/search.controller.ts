import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @RequiredAuth()
  findAll(@Query('q') query?: string) {
    if (!query) {
      throw new BadRequestException("query 'q' is required");
    }

    return this.searchService.search({ query });
  }
}
