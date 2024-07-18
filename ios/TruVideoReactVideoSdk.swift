import TruvideoSdkVideo
import Foundation
@objc(TruVideoReactVideoSdk)
class TruVideoReactVideoSdk: NSObject {

    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }
    
    
    @objc(compareVideos:withResolver:withRejecter:)
    func compareVideos(videos:[String], resolve:  @escaping  RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {
        let urlArray: [URL] = createUrlArray(videos: videos)
        Task{
            do {
                // Check if the videos can be concatenated using TruvideoSdkVideo
                let isConcat = try await TruvideoSdkVideo.canProcessConcatWith(videos: urlArray)
                resolve(isConcat)
            } catch {
                // If an error occurs, return false indicating concatenation is not possible
                reject("json_error", "Error parsing JSON", error)
            }
        }
    }
    
    @objc(getVideoInfo:withResolver:withRejecter:)
    func getVideoInfo(videos: String ,resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {
        Task {
            do {
                let urlArray: [URL] = [convertStringToURL(videos)]
                // Call TruvideoSdkVideo to retrieve information about the videos
                let result = try await TruvideoSdkVideo.getVideosInformation(videos: urlArray)
                resolve(result)
            } catch {
                reject("json_error", "Error parsing JSON", error)
                // Handle any errors that might occur during the process
            }
        }
    }
    
    func convertStringToURL(_ urlString: String) -> URL{
        guard let url = URL(string: urlString) else {
            return  URL(string: urlString)!
        }
        return url
    }
    func createUrlArray(videos : [String]) -> [URL]{
        var urlArray: [URL] = []
        for item in videos {
            urlArray.append(convertStringToURL(item))
        }
        return urlArray
    }
    
    @objc(generateThumbnail:withOutputURL:withResolver:withRejecter:)
    func generateThumbnail(videoURL: String,outputURL: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock)  {
        let input = TruvideoSdkVideoThumbnailInputVideo(
            videoURL: convertStringToURL(videoURL),
            outputURL: convertStringToURL(outputURL),
            position: 1000,
            width: 300,
            height: 300
        )
        Task{
            do {
                // Generate a thumbnail for the provided video using TruvideoSdkVideo's thumbnailGenerator
                let thumbnail = try await TruvideoSdkVideo.thumbnailGenerator.generateThumbnail(for: input)
                resolve(thumbnail)
                    // Handle result - thumbnail.generatedThumbnailURL
            } catch {
                reject("json_error", "Error parsing JSON", error)
                    // Handle any errors that occur during the thumbnail generation process
            }
        }
        
    }
    
    
    @objc(cleanNoise:withOutput:withResolver:withRejecter:)
    func cleanNoise(video: String, output: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock)  {
        let videoUrl = convertStringToURL(video)
        let outputUrl = convertStringToURL(output)
        Task{
            do {
                // Attempt to clean noise from the input video file using TruvideoSdkVideo's engine
                let result = try await TruvideoSdkVideo.engine.clearNoiseForFile(
                    at: videoUrl,
                    outputURL: outputUrl
                )
                resolve(result)
            } catch {
                reject("json_error", "Error parsing JSON", error)
                // Handle any errors that occur during the noise cleaning process
            }
        }
        
    }
    @objc(concatVideos:withOutput:withResolver:withRejecter:)
    func concatVideos(videos: [String], output: String ,resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {
        Task{
            do {
                let videoUrl = createUrlArray(videos: videos)
                let outputUrl = convertStringToURL(output)
                    // Concatenate the videos using ConcatBuilder
                let builder = TruvideoSdkVideo.ConcatBuilder(videos: videoUrl, outputURL: outputUrl)
                    // Print the output path of the concatenated video
                let result = builder.build()
                do{
                    let output = try? await result.process()
                    resolve(output)
                    await print("Successfully concatenated", output)
                }
                
            }
        }
        
    }
    
    @objc(mergeVideos:withOutput:withResolver:withRejecter:)
    func mergeVideos(videos: [String], output: String ,resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {
            // Create a MergeBuilder instance with specified parameters
        Task{
            let videoUrl = createUrlArray(videos: videos)
            let outputUrl = convertStringToURL(output)
            let builder = TruvideoSdkVideo.MergeBuilder(videos: videoUrl, width: 320, height: 640, videoCodec: .h264, audioCodec: .mp3, framesRate: .fiftyFps, outputURL: outputUrl)
            let result = builder.build()
                do{
                    let output = try? await result.process()
                    resolve(output)
                    await print("Successfully concatenated", output)
                }
        }
            // Print the output path of the merged video
    }
    
    @objc(changeEncoding:withOutput:withResolver:withRejecter:)
    func changeEncoding(video: String,output: String ,resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {
            // Create a EncodingBuilder instance with specified parameters
        Task{
            let videoUrl = convertStringToURL(video)
            let outputUrl = convertStringToURL(output)
            let builder = TruvideoSdkVideo.EncodingBuilder(at: videoUrl, width: 320, height: 240, videoCodec: .h264, audioCodec: .mp3, framesRate: .sixtyFps, outputURL: outputUrl)
            let result = builder.build()
            do{
                let output = try? await result.process()
                resolve(output)
                    // Print the output path of the concatenated video
                  print("Successfully concatenated", output)
            }
               
        }
    }
    @objc(editVideo:withOutput:withResolver:withRejecter:)
    func editVideo(video : String,output : String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock){
        guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
                        print("E_NO_ROOT_VIEW_CONTROLLER", "No root view controller found")
                        return
                    }
        let videoUrl = convertStringToURL(video)
        let outputUrl = convertStringToURL(output)
        let preset = TruvideoSdkVideoEditorPreset(
            videoURL: videoUrl,
            outputURL: outputUrl
        )
            
        // Present the TruvideoSdkVideoEditorView with the preset and handle the result
        rootViewController.presentTruvideoSdkVideoEditorView(preset: preset) { editionResult in
            // Handle result - editionResult.editedVideoURL
            // Print a success message along with the trimmer result
            resolve(editionResult)
            print("Successfully edited", editionResult)
        }
        
    }
}

