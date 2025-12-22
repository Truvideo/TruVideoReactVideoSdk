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
 * Concatenates multiple videos into a single video.
 *
 * @param {string[]} videoUris - An array of video URIs to concatenate.
 * @param {string} resultPath - The path where the concatenated video will be saved.
 * @return {Promise<string>} A Promise that resolves with the path of the concatenated video.
 */
export function concatVideos(
  videoUris: string[],
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.concatVideos(videoUris, resultPath);
}

/**
 * Encodes a video based on the provided video URI, result path, and configuration.
 *
 * @param {string} videoUri - The URI of the video to be encoded.
 * @param {string} resultPath - The path where the encoded video will be saved.
 * @param {string} config - The configuration for the encoding process.
 * @return {Promise<string>} A Promise that resolves to the path of the encoded video.
 */
export function encodeVideo(
  videoUri: string,
  resultPath: string,
  config: string
): Promise<string> {
  return TruVideoReactVideoSdk.changeEncoding(videoUri, resultPath, config);
}

/**
 * Retrieves information about a video located at the specified path.
 *
 * @param {string} videoPath - The path of the video for which to retrieve information.
 * @return {Promise<string>} A Promise that resolves to the information about the video.
 */
export function getVideoInfo(videoPath: string): Promise<MediaInfo | null> {
  return TruVideoReactVideoSdk.getVideoInfo(videoPath).then(
    (response: string) => {
      try {
        const parsed: MediaInfo = JSON.parse(response);
        return parsed;
      } catch (e) {
        console.error('Failed to parse MediaData JSON:', e);
        return null;
      }
    }
  );
}

/**
 * Compares multiple videos and returns the result as a promise of a string.
 *
 * @param {string[]} videoUris - An array of video URIs to compare.
 * @return {Promise<string>} A promise that resolves with the result of the comparison.
 */
export async function compareVideos(videoPath: string[]): Promise<Boolean> {
  return TruVideoReactVideoSdk.compareVideos(videoPath).then(
    (response: string) => {
      try {
        const parsed: Boolean = JSON.parse(response);
        return parsed;
      } catch (e) {
        console.error('Failed to parse MediaData JSON:', e);
        return false;
      }
    }
  );
}

/**
 * Merges multiple videos into a single video.
 *
 * @param {string[]} videoUris - An array of video URIs to merge.
 * @param {string} resultPath - The path where the merged video will be saved.
 * @param {string} config - The configuration for the merge operation.
 * @return {Promise<string>} A promise that resolves with the path of the merged video.
 */
export function mergeVideos(
  videoUris: string[],
  resultPath: string,
  config: string
): Promise<string> {
  return TruVideoReactVideoSdk.mergeVideos(videoUris, resultPath, config);
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
  videoUri: string,
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.cleanNoise(videoUri, resultPath);
}

// Define a class for the VideoTrack
export interface VideoTrack {
  index: string;
  width: string;
  height: string;
  rotatedWidth: string;
  rotatedHeight: string;
  codec: string;
  codecTag: string;
  pixelFormat: string;
  bitRate: string;
  frameRate: string;
  rotation: string;
  durationMillis: string;
}

// Define a class for the AudioTrack
export interface AudioTrack {
  index: string;
  bitRate: string;
  sampleRate: string;
  channels: string;
  codec: string;
  codecTag: string;
  durationMillis: string;
  channelLayout: string;
  sampleFormat: string;
}

// Define a class for the main response data
export interface MediaInfo {
  path: string;
  size: number;
  durationMillis: number;
  format: string;
  videoTracks: VideoTrack[];
  audioTracks: AudioTrack[];
}

export enum VideoStatus {
  processing = 'processing',
  completed = 'complete',
  idle = 'idle',
  cancel = 'cancelled',
  error = 'error',
}

export async function getAllRequest(
  status?: VideoStatus
): Promise<BuilderResponse[] | null> {
  return TruVideoReactVideoSdk.getAllRequest(status ? status : '').then(
    (response: string) => {
      try {
        const parsed: BuilderResponse[] = JSON.parse(response);
        return parsed;
      } catch (e) {
        console.error('Failed to parse MediaData JSON:', e);
        return null;
      }
    }
  );
}

export async function getRequestById(
  id: string
): Promise<BuilderResponse | null> {
  return TruVideoReactVideoSdk.getRequestById(id).then((response: string) => {
    try {
      const parsed: BuilderResponse = JSON.parse(response);
      return parsed;
    } catch (e) {
      console.error('Failed to parse MediaData JSON:', e);
      return null;
    }
  });
}

export function editVideo(
  videoUri: string,
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.editVideo(videoUri, resultPath);
}
export function getResultPath(videoPath: string): Promise<string> {
  return TruVideoReactVideoSdk.getResultPath(videoPath);
}

export enum FrameRate {
  twentyFourFps = 'twentyFourFps',
  twentyFiveFps = 'twentyFiveFps',
  thirtyFps = 'thirtyFps',
  fiftyFps = 'fiftyFps',
  sixtyFps = 'sixtyFps',
}

export enum BuilderType {
  merge = 'merge',
  concat = 'concat',
  encode = 'encode',
}

export interface BuilderResponse {
  id: string;
  createdAt: string;
  status: VideoStatus;
  type: BuilderType;
  updatedAt: string;
}


export class BuilderRequest {
  id: string;
  createdAt: string;
  status: VideoStatus;
  type: BuilderType;
  updatedAt: string;
  data : BuilderResponse;
  constructor(response : BuilderResponse){
    this.id = response.id;
    this.createdAt = response.createdAt;
    this.status = response.status;
    this.type = response.type;
    this.updatedAt = response.updatedAt
    this.data = response
  }

  async process(): Promise<BuilderResponse> {
    if (!this.id) {
      throw new Error(
        'Call build() and ensure it succeeds before calling process().'
      );
    }
    var response = await TruVideoReactVideoSdk.processVideo(this.id);
    this.data = JSON.parse(response) as BuilderResponse;
    return this.data;
  }

  async cancel(): Promise<BuilderResponse> {
    if (!this.id) {
      throw new Error(
        'Call build() and ensure it succeeds before calling cancel().'
      );
    }
    var response = await TruVideoReactVideoSdk.cancelVideo(this.id);
    this.data = JSON.parse(response) as BuilderResponse;
    return this.data;
  }

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

  async build(): Promise<BuilderResponse> {
    const config = {
      height: this.height,
      width: this.width,
      framesRate: this.frameRate,
    };

    var response = await TruVideoReactVideoSdk.mergeVideos(
      this._filePath,
      this.resultPath,
      JSON.stringify(config)
    );
    this.mergeData = JSON.parse(response) as BuilderResponse;
    return this.mergeData;
  }

  async process(): Promise<BuilderResponse> {
    if (!this.mergeData?.id) {
      throw new Error(
        'Call build() and ensure it succeeds before calling process().'
      );
    }
    var response = await TruVideoReactVideoSdk.processVideo(this.mergeData.id);
    this.mergeData = JSON.parse(response) as BuilderResponse;
    return this.mergeData;
  }

  async cancel(): Promise<BuilderResponse> {
    if (!this.mergeData?.id) {
      throw new Error(
        'Call build() and ensure it succeeds before calling cancel().'
      );
    }
    var response = await TruVideoReactVideoSdk.cancelVideo(this.mergeData.id);
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

  async build(): Promise<BuilderResponse> {
    var response = await TruVideoReactVideoSdk.concatVideos(
      this._filePath,
      this.resultPath
    );
    this.concatData = JSON.parse(response) as BuilderResponse;
    return this.concatData;
  }

  async process(): Promise<BuilderResponse> {
    if (!this.concatData?.id) {
      throw new Error(
        'concatData.id is undefined. Call build() and ensure it succeeds before calling process().'
      );
    }
    var response = await TruVideoReactVideoSdk.processVideo(this.concatData.id);
    this.concatData = JSON.parse(response) as BuilderResponse;
    return this.concatData;
  }

  async cancel(): Promise<BuilderResponse> {
    if (!this.concatData?.id) {
      throw new Error(
        'concatData.id is undefined. Call build() and ensure it succeeds before calling cancel().'
      );
    }
    var response = await TruVideoReactVideoSdk.cancelVideo(this.concatData.id);
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

  setWidth(width: number): EncodeBuilder {
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

  async build(): Promise<BuilderResponse> {
    const config = {
      height: this.height,
      width: this.width,
      framesRate: this.frameRate,
    };

    var response = await TruVideoReactVideoSdk.encodeVideo(
      this._filePath,
      this.resultPath,
      JSON.stringify(config)
    );
    this.mergeData = JSON.parse(response) as BuilderResponse;
    return this.mergeData;
  }

  async process(): Promise<BuilderResponse> {
    if (!this.mergeData?.id) {
      throw new Error(
        'Call build() and ensure it succeeds before calling process().'
      );
    }
    // process video
    var response = await TruVideoReactVideoSdk.processVideo(this.mergeData.id);
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
    var response = await TruVideoReactVideoSdk.cancelVideo(this.mergeData.id);

    this.mergeData = JSON.parse(response) as BuilderResponse;
    return this.mergeData;
  }
}
