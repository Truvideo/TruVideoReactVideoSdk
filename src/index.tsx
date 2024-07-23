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
