import { Controller, Get } from '@nestjs/common';

@Controller('ingredients')
export class IngredientController {
  @Get()
  ingredients() {
    return {
      ingredients: []
    }
  }
}
