import {
    Logger,
    type Provider,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
    AI_PROVIDER,
    type AiProvider,
} from './ai-provider.interface';
import { MockAiProvider } from './mock-ai.provider';
import { OpenAiProvider } from './openai.provider';

const logger = new Logger('AiProviderFactory');

export const aiProviderFactory: Provider = {
    provide: AI_PROVIDER,
    inject: [
        ConfigService,
        MockAiProvider,
        OpenAiProvider,
    ],
    useFactory: (
        configService: ConfigService,
        mockAiProvider: MockAiProvider,
        openAiProvider: OpenAiProvider,
    ): AiProvider => {
        const provider =
        configService
            .get<string>('AI_PROVIDER')
            ?.trim()
            .toLowerCase() ?? 'mock';

        switch (provider) {
        case 'openai':
            logger.log('Using OpenAI AI provider.');
            return openAiProvider;

        case 'mock':
            logger.log('Using mock AI provider.');
            return mockAiProvider;

        default:
            logger.warn(
                `Unknown AI provider "${provider}". Falling back to mock.`,
            );

            return mockAiProvider;
        }
    },
};
