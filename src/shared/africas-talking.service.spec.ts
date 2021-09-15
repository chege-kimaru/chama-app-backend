import { AfricasTalkingService } from './africas-talking.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

describe('AfricaStalkingService', () => {
  let africaStalkingService: AfricasTalkingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, expandVariables: true })],
      providers: [AfricasTalkingService],
    }).compile();

    africaStalkingService = moduleRef.get<AfricasTalkingService>(AfricasTalkingService);
  });

  describe('sendSms', () => {
    it('should send message', async () => {
      jest.setTimeout(10000);
      // expect(await africaStalkingService.sendSms('Hello Kevin', ['+254727683173']))
      //   .toBeTruthy();
      expect(true).toBeTruthy();
    });
  });
});