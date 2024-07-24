#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TruVideoReactVideoSdk, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(compareVideos:(NSArray *)videos 
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getVideoInfo:(NSString)video
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateThumbnail:(NSString)videoURL
                  withOutputURL:(NSString)outputURL
                  withPosition:(NSString)position
                  withWidth:(NSString)width
                  withHeight:(NSString)height
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(cleanNoise:(NSString)video
                  withOutput:(NSString)output
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(concatVideos:(NSArray *)videos
                  withOutput:(NSString *)outputURL
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(mergeVideos:(NSArray *)videos
                  withOutput:(NSString *)outputURL
                  withConfig:(NSString *)config
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(changeEncoding:(NSString)video
                  withOutput:(NSString)outputURL
                  withConfig:(NSString)config
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(editVideo:(NSString)video
                  withOutput:(NSString)outputURL
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
                 
RCT_EXTERN_METHOD(getResultPath:(NSString)path
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)



+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
