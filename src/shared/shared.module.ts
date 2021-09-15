import { Module } from '@nestjs/common';
import { AfricasTalkingService } from './africas-talking.service';
import { CloudinaryConfigService } from './cloudinary-config.service';
import { MpesaService } from './mpesa.service';
import { RaveService } from './rave.service';

@Module({
  providers: [CloudinaryConfigService, RaveService, AfricasTalkingService, MpesaService],
  exports: [CloudinaryConfigService, RaveService, AfricasTalkingService, MpesaService],
})
export class SharedModule {
}
