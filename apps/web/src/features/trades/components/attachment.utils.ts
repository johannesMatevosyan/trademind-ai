import {
    ACCEPTED_ATTACHMENT_MIME_TYPES,
    MAX_ATTACHMENT_SIZE_BYTES,
} from './attachment.constants';

interface ValidateAttachmentFilesOptions {
  files: File[];
  availableSlots: number;
}

interface ValidateAttachmentFilesResult {
  acceptedFiles: File[];
  errors: string[];
}

export function validateAttachmentFiles({
  files,
  availableSlots,
}: ValidateAttachmentFilesOptions): ValidateAttachmentFilesResult {
  const errors: string[] = [];
  const validFiles: File[] = [];

  for (const file of files) {
    if (
      !ACCEPTED_ATTACHMENT_MIME_TYPES.includes(
        file.type as
          (typeof ACCEPTED_ATTACHMENT_MIME_TYPES)[number],
      )
    ) {
      errors.push(
        `${file.name}: unsupported format. Use PNG, JPG, JPEG, or WEBP.`,
      );

      continue;
    }

    if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
      errors.push(
        `${file.name}: file is larger than 5 MB.`,
      );

      continue;
    }

    validFiles.push(file);
  }

  if (availableSlots <= 0) {
    return {
      acceptedFiles: [],
      errors: [
        ...errors,
        'This trade already has the maximum of 10 attachments.',
      ],
    };
  }

  if (validFiles.length > availableSlots) {
    errors.push(
      `Only ${availableSlots} more attachment${
        availableSlots === 1 ? '' : 's'
      } can be added to this trade.`,
    );
  }

  return {
    acceptedFiles: validFiles.slice(0, availableSlots),
    errors,
  };
}

export function formatFileSize(
  sizeInBytes: number,
): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  const sizeInKilobytes = sizeInBytes / 1024;

  if (sizeInKilobytes < 1024) {
    return `${sizeInKilobytes.toFixed(1)} KB`;
  }

  return `${(sizeInKilobytes / 1024).toFixed(2)} MB`;
}

export function createFileIdentity(file: File): string {
  return [
    file.name,
    file.size,
    file.lastModified,
  ].join(':');
}
