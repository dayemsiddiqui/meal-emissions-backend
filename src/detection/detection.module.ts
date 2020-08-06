import { Module } from '@nestjs/common';
import { DetectionController } from './detection.controller';
import { StorageService } from './storage/storage.service';

@Module({
  controllers: [DetectionController],
  providers: [StorageService]
})
export class DetectionModule {}
