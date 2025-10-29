import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { validateEnv } from './config/validate-env';
import { PrismaModule } from './database/module/prisma.module';
import { EventsModule } from './events/events.module';
import { AddressesModule } from './features/addresses/addresses.module';
import { AuthModule } from './features/auth/auth.module';
import { BankAccountsModule } from './features/bank-accounts/bank-accounts.module';
import { BankTransferModule } from './features/bank-transfer/bank-transfer.module';
import { BookReviewsModule } from './features/book-reviews/book-reviews.module';
import { CategoriesModule } from './features/categories/categories.module';
import { FileManagerModule } from './features/file-manager/file-manager.module';
import { InvitationsModule } from './features/invitations/invitations.module';
import { OrdersModule } from './features/orders/orders.module';
import { PaymentsModule } from './features/payments/payments.module';
import { ProfileModule } from './features/profile/profile.module';
import { RolesModule } from './features/roles/roles.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { UsersModule } from './features/users/users.module';
import { StorageModule } from './providers/storage/storage.module';
import { SeedModule } from './seed/seed.module';
import { AdminModule } from './features/admin/admin.module';
import { BooksModule } from './features/books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    FileManagerModule,
    StorageModule,
    SeedModule,
    BooksModule,
    AuthModule,
    UsersModule,
    AdminModule,
    RolesModule,
    AddressesModule,
    PrismaModule,
    EventsModule,
    CategoriesModule,
    OrdersModule,
    BookReviewsModule,
    ProfileModule,
    BankTransferModule,
    BankAccountsModule,
    PaymentsModule,
    TransactionsModule,
    InvitationsModule,
  ],
  controllers: [],
  providers: [ConfigService],
  exports: [],
})
export class AppModule { }
