import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InterceptedFile } from './models/InterceptedFile.model';
import { StorageService } from './storage/storage.service';

@Controller('detect')
export class DetectionController {

  constructor(private storage: StorageService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  detect(@UploadedFile() file: InterceptedFile) {
    this.storage.write(file)
    return { status: 'success', payload: [{ file: file.originalname, mimeType: file.mimetype }] }
  }
}
