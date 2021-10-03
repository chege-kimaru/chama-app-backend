import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupAdminGuard } from './guards/group-admin.guard';
import { GroupMiddleware } from './middlewares/group.middleware';
import { GroupMember } from './models/group-member.model';
import { Group } from './models/group.model';

@Module({
  imports: [
    AuthModule,
    SharedModule,
    SequelizeModule.forFeature([Group, GroupMember]),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupAdminGuard]
})
export class GroupModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GroupMiddleware)
      .exclude(
        { path: 'groups', method: RequestMethod.POST },
        { path: 'groups', method: RequestMethod.GET },
        { path: 'groups/user', method: RequestMethod.GET },
      )
      .forRoutes(GroupController)
  }

}
