import TruvideoSdkVideo
import Foundation
@objc(TruVideoReactVideoSdk)
class TruVideoReactVideoSdk: NSObject {
    
    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }
    
    @objc(getResultPath:withResolver:withRejecter:)
    func getResultPath(path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let fileManager = FileManager.default
        
        do {
            let documentsURL = try fileManager.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            let resultPath = documentsURL.appendingPathComponent(path).path
            resolve(resultPath)
        } catch {
            let error = NSError(domain: "com.yourdomain.yourapp", code: 500, userInfo: [NSLocalizedDescriptionKey: "Failed to get document directory path"])
            reject("no_path", "There is no result path", error)
        }
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
                resolve(result.description)
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
    
    @objc(generateThumbnail:withOutputURL:withPosition:withWidth:withHeight:withResolver:withRejecter:)
    func generateThumbnail(videoURL: String,outputURL: String,position: String,width: String,height: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock)  {
        if let positionTime = Double(position){
            let input = TruvideoSdkVideoThumbnailInputVideo(
                videoURL: convertStringToURL(videoURL),
                outputURL: convertStringToURL(outputURL),
                position: positionTime,
                width: Int(width),
                height: Int(height)
            )
            Task{
                do {
                    // Generate a thumbnail for the provided video using TruvideoSdkVideo's thumbnailGenerator
                    let thumbnail = try await TruvideoSdkVideo.thumbnailGenerator.generateThumbnail(for: input)
                    resolve(thumbnail.generatedThumbnailURL.absoluteString)
                    // Handle result - thumbnail.generatedThumbnailURL
                } catch {
                    reject("json_error", "Error parsing JSON", error)
                    // Handle any errors that occur during the thumbnail generation process
                }
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
                resolve(result.fileURL.absoluteString)
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
                    resolve(output?.videoURL.absoluteString)
                    await print("Successfully concatenated", output?.videoURL.absoluteString)
                }
                
            }
        }
        
    }
    
    @objc(mergeVideos:withOutput:withConfig:withResolver:withRejecter:)
    func mergeVideos(videos: [String], output: String,config : String ,resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {
        // Create a MergeBuilder instance with specified parameters
        Task{
            let videoUrl = self.createUrlArray(videos: videos)
            let outputUrl = self.convertStringToURL(output)
            guard let data = config.data(using: .utf8) else {
                print("Invalid JSON string")
                reject("json_error", "Invalid JSON string", nil)
                return
            }
            do {
                if let configuration = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                    print(configuration)
                    guard let width = configuration["width"] as? Double else {
                        return
                    }
                    guard let height = configuration["height"] as? Double else{
                        return
                    }
                    if let frameRateStr = configuration["framesRate"], let videoCodec = configuration["videoCodec"]{
                        
                        let builder = TruvideoSdkVideo.MergeBuilder(videos: videoUrl, width: width, height: height, videoCodec: self.videoCodecString(videoCodec as! String), audioCodec: .mp3, framesRate: self.frameRate(frameRateStr as! String) , outputURL: outputUrl)
                        let result = builder.build()
                        do{
                            let output = try? await result.process()
                            resolve(output?.videoURL.absoluteString)
                            await print("Successfully concatenated", output?.videoURL.absoluteString)
                        }
                    } else {
                        print("Invalid JSON format")
                        reject("json_error", "Invalid JSON format", nil)
                    }
                }
            }catch {
                print("Error parsing JSON: \(error.localizedDescription)")
                reject("json_error", "Error parsing JSON", error)
            }
            
            
        }
        // Print the output path of the merged video
    }
    
    func frameRate(_ frameRateStr: String ) -> TruvideoSdkVideo.TruvideoSdkVideoFrameRate{
        return switch frameRateStr {
        case "twentyFourFps":
            .twentyFourFps
        case "twentyFiveFps":
            .twentyFiveFps
        case "thirtyFps":
             .thirtyFps
        case "fiftyFps":
            .fiftyFps
        case "sixtyFps":
            .sixtyFps
        default :
            .fiftyFps
        }
    }
    func videoCodecString(_ videoCodecStr: String ) -> TruvideoSdkVideo.TruvideoSdkVideoVideoCodec{
        return switch videoCodecStr {
        case "h264":
            .h264
        case "h265":
            .h265
        default :
            .h264
        }
    }
    @objc(changeEncoding:withOutput:withConfig:withResolver:withRejecter:)
    func changeEncoding(video: String,output: String,config :String ,resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) {
        // Create a EncodingBuilder instance with specified parameters
        Task{
            let videoUrl = convertStringToURL(video)
            let outputUrl = convertStringToURL(output)
             guard let data = config.data(using: .utf8) else {
                print("Invalid JSON string")
                reject("json_error", "Invalid JSON string", nil)
                return
            }
            do {
                if let configuration = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                    print(configuration)
                    guard let width = configuration["width"] as? Double else {
                        return
                    }
                    guard let height = configuration["height"] as? Double else{
                        return
                    }
                    if let frameRateStr = configuration["framesRate"], let videoCodec = configuration["videoCodec"]{
                        
                        let builder = TruvideoSdkVideo.EncodingBuilder(at: videoUrl, width: width, height: height, videoCodec: videoCodecString(videoCodec as! String), audioCodec: .mp3, framesRate: frameRate(frameRateStr as! String) , outputURL: outputUrl)
                        let result = builder.build()
                        do{
                            let output = try? await result.process()
                            resolve(output?.videoURL.absoluteString)
                            await print("Successfully concatenated", output?.videoURL.absoluteString)
                        }
                    } else {
                        print("Invalid JSON format")
                        reject("json_error", "Invalid JSON format", nil)
                    }
                }
            }catch {
                print("Error parsing JSON: \(error.localizedDescription)")
                reject("json_error", "Error parsing JSON", error)
            }
            
        }
    }
    @objc(editVideo:withOutput:withResolver:withRejecter:)
    func editVideo(video : String,output : String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock){
        DispatchQueue.main.async{
        guard let rootViewController = UIApplication.shared.keyWindow?.rootViewController else {
            print("E_NO_ROOT_VIEW_CONTROLLER", "No root view controller found")
            return
        }
            let videoUrl = self.convertStringToURL(video)
            let outputUrl = self.convertStringToURL(output)
        let preset = TruvideoSdkVideoEditorPreset(
            videoURL: videoUrl,
            outputURL: outputUrl
        )
        
        // Present the TruvideoSdkVideoEditorView with the preset and handle the result
        rootViewController.presentTruvideoSdkVideoEditorView(preset: preset) { editionResult in
            // Handle result - editionResult.editedVideoURL
            // Print a success message along with the trimmer result
            resolve(editionResult.editedVideoURL?.absoluteString)
            print("Successfully edited", editionResult.editedVideoURL?.absoluteString)
        }
        
        }
    }
}

