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
            let outputFolderURL = documentsURL.appendingPathComponent("output")
            if !fileManager.fileExists(atPath: outputFolderURL.path) {
                try fileManager.createDirectory(at: outputFolderURL, withIntermediateDirectories: true, attributes: nil)
            }
            let resultPath = outputFolderURL.appendingPathComponent(path).path
            resolve(resultPath)
        } catch {
            // Handle errors and reject the promise
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
        guard let url = URL(string: "file://\(urlString)") else {
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
                    
                    // Parse width and height from strings
                    guard let widthStr = configuration["width"] as? String, let width = CGFloat(Double(widthStr) ?? 0) as? CGFloat else {
                        print("Width is not a valid string or missing")
                        return
                    }
                    
                    guard let heightStr = configuration["height"] as? String, let height = CGFloat(Double(heightStr) ?? 0) as? CGFloat else {
                        print("Height is not a valid string or missing")
                        return
                    }
                    // Parse frameRate and videoCodec as strings
                    guard let frameRateStr = configuration["framesRate"] as? String,
                          let videoCodec = configuration["videoCodec"] as? String else {
                        print("framesRate or videoCodec are not valid strings or missing")
                        return
                    }
                    
                    let builder = TruvideoSdkVideo.MergeBuilder(
                        videos: videoUrl,
                        width: width,
                        height: height,
                        videoCodec: self.videoCodecString(videoCodec),
                        audioCodec: .mp3,
                        framesRate: self.frameRate(frameRateStr),
                        outputURL: outputUrl
                    )
                    
                    let result = builder.build()
                    do {
                        if let output = try? await result.process() {
                            resolve(output.videoURL.absoluteString)
                            await print("Successfully concatenated", output.videoURL.absoluteString ?? "")
                        } else {
                            reject("process_error", "Failed to process video merge", nil)
                        }
                    } catch {
                        reject("process_error", "Failed to process video merge: \(error.localizedDescription)", error)
                    }
                } else {
                    print("Invalid JSON format")
                    reject("json_error", "Invalid JSON format", nil)
                }
            } catch {
                print("JSON parsing error: \(error.localizedDescription)")
                reject("json_error", "JSON parsing error: \(error.localizedDescription)", error)
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
                    guard let widthStr = configuration["width"] as? String, let width = CGFloat(Double(widthStr) ?? 0) as? CGFloat else {
                        print("Width is not a valid string or missing")
                        return
                    }
                    
                    guard let heightStr = configuration["height"] as? String, let height = CGFloat(Double(heightStr) ?? 0) as? CGFloat else {
                        print("Height is not a valid string or missing")
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
            rootViewController.presentTruvideoSdkVideoEditorView(preset: preset) { editionResult in
                resolve(editionResult.editedVideoURL?.absoluteString)
                print("Successfully edited", editionResult.editedVideoURL?.absoluteString)
            }
            
        }
    }
}

