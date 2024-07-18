#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TruVideoReactVideoSdk, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(compareVideos:([NSString])videos 
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getVideoInfo:(NSString)video
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateThumbnail:(NSString)videoURL
                 withOutputURL:(NSString)outputURL
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(cleanNoise:(NSString)video
                 withOutput:(NSString)output
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(concatVideos:([NSString])videos
                 withOutput:(NSString)outputURL
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(mergeVideos:([NSString])videos
                 withOutput:(NSString)outputURL
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(changeEncoding:(NSString)video
                  withOutput:(NSString)outputURL
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(editVideo:(NSString)video
                  withOutput:(NSString)outputURL
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)



+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
