import { Controller, Get } from '@nestjs/common';

@Controller('detect')
export class DetectionController {
  @Get()
  detect() {
    return { status: 'success', payload: [] }
  }
}
