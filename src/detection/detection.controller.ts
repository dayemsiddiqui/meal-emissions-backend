import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InterceptedFile } from './models/InterceptedFile.model';
import { StorageService } from './storage/storage.service';
import { DetectorService } from './detector/detector.service';
const {PredictionServiceClient} = require('@google-cloud/automl').v1;

@Controller('detect')
export class DetectionController {
  client
  constructor(private storage: StorageService, private detectorService: DetectorService) {
    // Creates a client
     this.client = new PredictionServiceClient();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async detect(@UploadedFile() file: InterceptedFile) {
    const filePath = this.storage.write(file)
    
    const prediction = await this.predict(file)
    const results = await this.detectorService.process(file)
    return { status: 'success', payload: results }
  }

  async predict(file: InterceptedFile) {
    // Construct request
    // params is additional domain-specific parameters.
    // score_threshold is used to filter the result
    const request = {
      name: this.client.modelPath('68979267479', 'us-central1', 'ICN1137548133027282944'),
      payload: {
        image: {
          imageBytes: file.buffer,
        },
      },
    };

    const [response] = await this.client.predict(request);
    const [prediction] = response.payload
    return prediction.displayName
  }

}
