import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'truvideo-react-video-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const TruVideoReactVideoSdk = NativeModules.TruVideoReactVideoSdk
  ? NativeModules.TruVideoReactVideoSdk
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export function multiply(a: number, b: number): Promise<number> {
  return TruVideoReactVideoSdk.multiply(a, b);
}

/**
 * Retrieves information about a video located at the specified path.
 *
 * @param {string} videoPath - The path of the video for which to retrieve information.
 * @return {Promise<string>} A Promise that resolves to the information about the video.
 */
export function getVideoInfo(videoPath: string): Promise<string> {
  return TruVideoReactVideoSdk.getVideoInfo(videoPath);
}

/**
 * Compares multiple videos and returns the result as a promise of a string.
 *
 * @param {string[]} videoUris - An array of video URIs to compare.
 * @return {Promise<string>} A promise that resolves with the result of the comparison.
 */
export function compareVideos(videoUris: string[]): Promise<string> {
  return TruVideoReactVideoSdk.compareVideos(videoUris);
}

/**
 * Generates a thumbnail for a video based on the provided paths and dimensions.
 *
 * @param {string} videoPath - The path of the video for which to generate a thumbnail.
 * @param {string} resultPath - The path where the generated thumbnail will be saved.
 * @param {string} position - The position of the thumbnail in the video.
 * @param {string} width - The width of the generated thumbnail.
 * @param {string} height - The height of the generated thumbnail.
 * @return {Promise<string>} A Promise that resolves to the path of the generated thumbnail.
 */
export function generateThumbnail(
  videoPath: string,
  resultPath: string,
  position: string,
  width: string,
  height: string
): Promise<string> {
  return TruVideoReactVideoSdk.generateThumbnail(
    videoPath,
    resultPath,
    position,
    width,
    height
  );
}

/**
 * Cleans noise from a video file and saves the result to a specified path.
 *
 * @param {string} videoPath - The path of the video file to clean noise from.
 * @param {string} resultPath - The path where the cleaned video file will be saved.
 * @return {Promise<string>} A Promise that resolves to the path of the cleaned video file.
 */
export function cleanNoise(
  videoPath: string,
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.cleanNoise(videoPath, resultPath);
}

/**
 * Edits a video and saves the result to a specified path.
 *
 * @param {string} videoUri - The URI of the video to be edited.
 * @param {string} resultPath - The path where the edited video will be saved.
 * @return {Promise<string>} A Promise that resolves to the path of the edited video.
 */
export function editVideo(
  videoUri: string,
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.editVideo(videoUri, resultPath);
}

/**
 * Gets the result path for the provided path.
 *
 * @param {string} path - The path for which to get the result path.
 * @return {Promise<string>} A Promise that resolves to the result path.
 */
export function getResultPath(path: string): Promise<string> {
  return TruVideoReactVideoSdk.getResultPath(path);
}

export enum FrameRate {
  twentyFourFps = 'twentyFourFps',
  twentyFiveFps = 'twentyFiveFps',
  thirtyFps = 'thirtyFps',
  fiftyFps = 'fiftyFps',
  sixtyFps = 'sixtyFps',
}

export interface BuilderResponse {
  id: string;
  createdAt: string;
  status: string;
  type: string;
  updatedAt: string;
}

export class MergeBuilder {
  private _filePath: string[];
  private resultPath: string;
  private height: string = '';
  private width: string = '';
  private frameRate: string = '';
  private mergeData: BuilderResponse | undefined;

  constructor(filePaths: string[], resultPath: string) {
    if (!filePaths) {
      throw new Error('filePath is required for MediaBuilder.');
    }
    if (!resultPath) {
      throw new Error('resultPath is required for MediaBuilder.');
    }
    this._filePath = filePaths;
    this.resultPath = resultPath;
  }

  setHeight(height: number): MergeBuilder {
    this.height = '' + height;
    return this;
  }

  setWigth(width: number): MergeBuilder {
    this.width = '' + width;
    return this;
  }

  setFrameRate(frameRate: FrameRate) {
    if (frameRate == FrameRate.fiftyFps) {
      this.frameRate = 'fiftyFps';
    } else if (frameRate == FrameRate.sixtyFps) {
      this.frameRate = 'sixtyFps';
    } else if (frameRate == FrameRate.twentyFourFps) {
      this.frameRate = 'twentyFourFps';
    } else if (frameRate == FrameRate.twentyFiveFps) {
      this.frameRate = 'twentyFiveFps';
    } else if (frameRate == FrameRate.thirtyFps) {
      this.frameRate = 'thirtyFps';
    } else {
      this.frameRate = 'fiftyFps';
    }
  }

  async build(): Promise<MergeBuilder> {
    const config = {
      height: this.height,
      width: this.width,
      framesRate: this.frameRate,
    };

    let response = await TruVideoReactVideoSdk.mergeVideos(
      this._filePath,
      this.resultPath,
      JSON.stringify(config)
    );
    this.mergeData = JSON.parse(response);
    return this;
  }

  async process(): Promise<BuilderResponse> {
    if (!this.mergeData?.id) {
      throw new Error(
        'Call build() and ensure it succeeds before calling process().'
      );
    }
    let response = await TruVideoReactVideoSdk.processVideo(
      this.mergeData.id
    );
    this.mergeData = JSON.parse(response) as BuilderResponse;
    return this.mergeData;
  }

  async cancel(): Promise<BuilderResponse> {
    if (!this.mergeData?.id) {
      throw new Error(
        'Call build() and ensure it succeeds before calling cancel().'
      );
    }
    let response = await TruVideoReactVideoSdk.cancelVideo(
      this.mergeData.id
    );
    this.mergeData = JSON.parse(response) as BuilderResponse;
    return this.mergeData;
  }
}

export class ConcatBuilder {
  private _filePath: string[];
  private resultPath: string;
  private concatData: BuilderResponse | undefined;

  constructor(filePaths: string[], resultPath: string) {
    if (!filePaths) {
      throw new Error('filePath is required for ConcatBuilder.');
    }
    if (!resultPath) {
      throw new Error('resultPath is required for ConcatBuilder.');
    }
    this._filePath = filePaths;
    this.resultPath = resultPath;
  }

  async build(): Promise<ConcatBuilder> {
    let response = await TruVideoReactVideoSdk.concatVideos(
      this._filePath,
      this.resultPath
    );
    this.concatData = JSON.parse(response);
    return this;
  }

  async process(): Promise<BuilderResponse> {
    if (!this.concatData?.id) {
      throw new Error(
        'concatData.id is undefined. Call build() and ensure it succeeds before calling process().'
      );
    }
    let response = await TruVideoReactVideoSdk.processVideo(
      this.concatData.id
    );
    this.concatData = JSON.parse(response) as BuilderResponse;
    return this.concatData;
  }

  async cancel(): Promise<BuilderResponse> {
    if (!this.concatData?.id) {
      throw new Error(
        'concatData.id is undefined. Call build() and ensure it succeeds before calling cancel().'
      );
    }
    let response = await TruVideoReactVideoSdk.cancelVideo(
      this.concatData.id
    );
    this.concatData = JSON.parse(response) as BuilderResponse;
    return this.concatData;
  }
}

export class EncodeBuilder {
  private _filePath: string;
  private resultPath: string;
  private height: string = '';
  private width: string = '';
  private frameRate: string = '';
  private mergeData: BuilderResponse | undefined;

  constructor(filePaths: string, resultPath: string) {
    if (!filePaths) {
      throw new Error('filePath is required for EncodeBuilder.');
    }
    if (!resultPath) {
      throw new Error('resultPath is required for EncodeBuilder.');
    }
    this._filePath = filePaths;
    this.resultPath = resultPath;
  }

  setHeight(height: number): EncodeBuilder {
    this.height = '' + height;
    return this;
  }

  setWigth(width: number): EncodeBuilder {
    this.width = '' + width;
    return this;
  }

  setFrameRate(frameRate: FrameRate) {
    if (frameRate == FrameRate.fiftyFps) {
      this.frameRate = 'fiftyFps';
    } else if (frameRate == FrameRate.sixtyFps) {
      this.frameRate = 'sixtyFps';
    } else if (frameRate == FrameRate.twentyFourFps) {
      this.frameRate = 'twentyFourFps';
    } else if (frameRate == FrameRate.twentyFiveFps) {
      this.frameRate = 'twentyFiveFps';
    } else if (frameRate == FrameRate.thirtyFps) {
      this.frameRate = 'thirtyFps';
    } else {
      this.frameRate = 'fiftyFps';
    }
  }

  async build(): Promise<EncodeBuilder> {
    const config = {
      height: this.height,
      width: this.width,
      framesRate: this.frameRate,
    };

    let response = await TruVideoReactVideoSdk.encodeVideo(
      this._filePath,
      this.resultPath,
      JSON.stringify(config)
    );
    this.mergeData = JSON.parse(response);
    return this;
  }

  async process(): Promise<BuilderResponse> {
    if (!this.mergeData?.id) {
      throw new Error(
        'Call build() and ensure it succeeds before calling process().'
      );
    }
    // process video
    let response = await TruVideoReactVideoSdk.processVideo(
      this.mergeData.id
    );
    this.mergeData = JSON.parse(response) as BuilderResponse;
    return this.mergeData;
  }

  async cancel(): Promise<BuilderResponse> {
    if (!this.mergeData?.id) {
      throw new Error(
        'Call build() and ensure it succeeds before calling cancel().'
      );
    }
    // cancel video
    let response = await TruVideoReactVideoSdk.cancelVideo(
      this.mergeData.id
    );

    this.mergeData = JSON.parse(response) as BuilderResponse;
    return this.mergeData;
  }
}

