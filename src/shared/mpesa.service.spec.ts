import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MpesaService } from './mpesa.service';

describe('MpesaService', () => {
    let mpesaService: MpesaService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true, expandVariables: true })],
            providers: [MpesaService],
        }).compile();

        mpesaService = moduleRef.get<MpesaService>(MpesaService);
    });

    describe('b2cRate', () => {
        it('should return 0 when amount is 20', async () => {
            expect(mpesaService.b2cCharge(20)
            ).toEqual(0);
        });
        it('should return 15.27  when amount is 50', async () => {
            expect(mpesaService.b2cCharge(50)
            ).toEqual(15.27);
        });
        it('should return 15.27  when amount is 80', async () => {
            expect(mpesaService.b2cCharge(80)
            ).toEqual(15.27);
        });
        it('should return 15.27 when amount is 100', async () => {
            expect(mpesaService.b2cCharge(100)
            ).toEqual(15.27);
        });
        it('should return 15.27  when amount is 1000', async () => {
            expect(mpesaService.b2cCharge(1000)
            ).toEqual(15.27);
        });
        it('should return 22.40  when amount is 1000.1', async () => {
            expect(mpesaService.b2cCharge(1000.1)
            ).toEqual(22.40);
        });
        it('should return 22.40  when amount is 10000', async () => {
            expect(mpesaService.b2cCharge(10000)
            ).toEqual(22.40);
        });
    });
});