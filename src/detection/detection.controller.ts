import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InterceptedFile } from './models/InterceptedFile.model';
import { StorageService } from './storage/storage.service';
import { DetectorService } from './detector/detector.service';

@Controller('detect')
export class DetectionController {

  constructor(private storage: StorageService, private detectorService: DetectorService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async detect(@UploadedFile() file: InterceptedFile) {
    this.storage.write(file)
    const result = await this.detectorService.process(file)
    return { status: 'success', payload: result }
  }
}
