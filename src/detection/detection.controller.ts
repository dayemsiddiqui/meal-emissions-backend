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

    // Performs label detection on the image file
    const [result] = await this.client.labelDetection(filePath);
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
    const results = await this.detectorService.process(file)
    return { status: 'success', payload: results }
  }

  async predict(file: InterceptedFile) {
    // Construct request
    // params is additional domain-specific parameters.
    // score_threshold is used to filter the result
    const request = {
      name: this.client.modelPath('elated-bebop-154812', location, modelId),
      payload: {
        image: {
          imageBytes: file.buffer,
        },
      },
    };

    const [response] = await this.client.predict(request);

    for (const annotationPayload of response.payload) {
      console.log(`Predicted class name: ${annotationPayload.displayName}`);
      console.log(
        `Predicted class score: ${annotationPayload.classification.score}`
      );
    }
  }

}
