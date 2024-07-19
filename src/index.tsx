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
export function concatVideos(
  videoUris: string[],
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.concatVideos(videoUris, resultPath);
}

export function encodeVideo(
  videoUri: string,
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.changeEncoding(videoUri, resultPath);
}

export function getVideoInfo(videoPath: string): Promise<string> {
  return TruVideoReactVideoSdk.getVideoInfo(videoPath);
}

export function compareVideos(videoUris: string[]): Promise<string> {
  return TruVideoReactVideoSdk.compareVideos(videoUris);
}

export function mergeVideos(
  videoUris: string[],
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.mergeVideos(videoUris, resultPath);
}

export function generateThumbnail(
  videoPath: string,
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.generateThumbnail(videoPath, resultPath);
}

export function cleanNoise(
  videoPath: string,
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.cleanNoise(videoPath, resultPath);
}

export function editVideo(
  videoUri: string,
  resultPath: string
): Promise<string> {
  return TruVideoReactVideoSdk.editVideo(videoUri, resultPath);
}

export function getAllRequest(): Promise<string> {
  return TruVideoReactVideoSdk.getAllRequest();
}

export function getResultPath(path: string): string {
  return TruVideoReactVideoSdk.getResultPath(path);
}