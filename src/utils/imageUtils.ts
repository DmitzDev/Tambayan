import { ImageSourcePropType } from 'react-native';

const DEFAULT_AVATAR = require('../../assets/images/app_icon.png');

export class ImageUtils {
  static getImageSource(input?: string | null): ImageSourcePropType {
    if (!input || typeof input !== 'string' || input.trim() === '') {
      return DEFAULT_AVATAR;
    }

    const trimmed = input.trim();

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return { uri: trimmed };
    }

    if (trimmed.startsWith('data:image/')) {
      return { uri: trimmed };
    }

    // Raw base64 string
    return { uri: `data:image/jpeg;base64,${trimmed}` };
  }
}
