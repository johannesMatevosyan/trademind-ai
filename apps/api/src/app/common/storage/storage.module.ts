import { Module } from '@nestjs/common';

import { LocalFileStorageService } from './local-file-storage.service';
import { FILE_STORAGE_SERVICE } from './storage.constants';
import { UploadsController } from './uploads.controller';

@Module({
    controllers: [UploadsController],
    providers: [
        LocalFileStorageService,
        {
        provide: FILE_STORAGE_SERVICE,
        useExisting: LocalFileStorageService,
        },
    ],
    exports: [FILE_STORAGE_SERVICE],
})
export class StorageModule {}
