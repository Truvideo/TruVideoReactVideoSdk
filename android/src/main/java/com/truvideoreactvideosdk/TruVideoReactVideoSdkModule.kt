package com.truvideoreactvideosdk

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.google.gson.Gson
import com.truvideo.sdk.video.TruvideoSdkVideo
import com.truvideo.sdk.video.model.TruvideoSdkVideoFile
import com.truvideo.sdk.video.model.TruvideoSdkVideoFileDescriptor
import com.truvideo.sdk.video.model.TruvideoSdkVideoFrameRate
import com.truvideo.sdk.video.model.TruvideoSdkVideoRequest
import com.truvideo.sdk.video.model.TruvideoSdkVideoRequestStatus
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.time.format.DateTimeFormatter

class TruVideoReactVideoSdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  val scope = CoroutineScope(Dispatchers.Main)
  val gson = Gson()
  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "TruVideoReactVideoSdk"
    var mainPromise: Promise? = null
    var promise2: Promise? = null
  }

  @ReactMethod
  fun multiply(a: Int, b: Int, promise: Promise) {
    promise.resolve(a * b)
  }


  @ReactMethod
  fun encodeVideo(

    videoUri: String?,

    resultPath: String?,

    config: String?,

    promise: Promise?

  ) {

// Change encoding of video and save to resultPath

    // Build the encode builder

    if (videoUri == null || resultPath == null) {

      promise?.resolve("input path or result path not valid")

      return

    }

    if (videoUri.endsWith(".png") || videoUri.endsWith(".jpg") || videoUri.endsWith(".jpeg")) {

      promise?.resolve("input path must be video not image")

      return

    }

    val result = TruvideoSdkVideo.EncodeBuilder(
      videoFile(videoUri),
      videoFileDescriptor(resultPath)
    )

    val configuration = JSONObject(config!!)
    if (configuration.has("height")) {
      result.height = configuration.getInt("height")
    }

    if (configuration.has("width")) {
      result.width = configuration.getInt("width")
    }

    if (configuration.has("framesRate")) {
      when (configuration.getString("framesRate")) {
        "twentyFourFps" -> result.framesRate = TruvideoSdkVideoFrameRate.twentyFourFps
        "twentyFiveFps" -> result.framesRate = TruvideoSdkVideoFrameRate.twentyFiveFps
        "thirtyFps" -> result.framesRate = TruvideoSdkVideoFrameRate.thirtyFps
        "fiftyFps" -> result.framesRate = TruvideoSdkVideoFrameRate.fiftyFps
        "sixtyFps" -> result.framesRate = TruvideoSdkVideoFrameRate.sixtyFps
        else -> result.framesRate = TruvideoSdkVideoFrameRate.defaultFrameRate
      }
    }

    try {
      scope.launch {
        val request = result.build()
        promise?.resolve(returnRequest(request))
      }
    } catch (e: Exception) {
      promise?.reject("Exception", e.message.toString())
    }
  }


  @ReactMethod
  fun getRequestById(id: String, promise: Promise) {
    try {
      scope.launch {
        val request = TruvideoSdkVideo.getRequestById(id)
        promise.resolve(returnRequest(request!!))
      }
    } catch (e: Exception) {
      promise.reject("Exception", e.message)
    }
  }

  @ReactMethod
  fun getAllRequest(status: String, promise: Promise) {

    scope.launch {

      val status = when (status) {

        "cancelled" -> {

          TruvideoSdkVideoRequestStatus.CANCELLED

        }

        "processing" -> {

          TruvideoSdkVideoRequestStatus.PROCESSING

        }

        "complete" -> {

          TruvideoSdkVideoRequestStatus.COMPLETE

        }

        "idle" -> {

          TruvideoSdkVideoRequestStatus.IDLE

        }

        "error" -> {

          TruvideoSdkVideoRequestStatus.ERROR

        }

        else -> {

          null

        }

      }

      val request = TruvideoSdkVideo.getAllRequests(status)

      promise.resolve(returnRequests(request))

    }

  }

  @ReactMethod
  fun processVideo(id: String, promise: Promise) {

    try {

      scope.launch {

        val request = TruvideoSdkVideo.getRequestById(id)

        request!!.process()

        promise.resolve(returnRequest(request))

      }

    } catch (e: Exception) {

      promise.reject("Exception", e.message)

    }

  }

  fun delete(id: String, promise: Promise) {
    try {
      scope.launch {
        val request = TruvideoSdkVideo.getRequestById(id)
        request!!.delete()
        promise.resolve(returnRequest(request))
      }

    } catch (e: Exception) {
      promise.reject("Exception", e.message)
    }
  }

  @ReactMethod
  fun cancelVideo(id: String, promise: Promise) {

    try {

      scope.launch {

        val request = TruvideoSdkVideo.getRequestById(id)

        request!!.cancel()

        promise.resolve(returnRequest(request))

      }

    } catch (e: Exception) {

      promise.reject("Exception", e.message)

    }

  }
  fun returnRequest(request: TruvideoSdkVideoRequest): String {
    return JSONObject().apply {

      put("id", request.id)

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

        put("createdAt", DateTimeFormatter.ISO_INSTANT.format(request.createdAt.toInstant()))

        put("updatedAt", DateTimeFormatter.ISO_INSTANT.format(request.updatedAt.toInstant()))

      } else {

        put("createdAt", request.createdAt)

        put("updatedAt", request.updatedAt)

      }

      put(
        "status", when (request.status) {

          TruvideoSdkVideoRequestStatus.IDLE -> "idle"

          TruvideoSdkVideoRequestStatus.PROCESSING -> "processing"

          TruvideoSdkVideoRequestStatus.ERROR -> "error"

          TruvideoSdkVideoRequestStatus.COMPLETE -> "complete"

          TruvideoSdkVideoRequestStatus.CANCELLED -> "cancelled"

        }
      )

      put("type", request.type.name.lowercase())

    }.toString()
  }

  fun returnRequests(requests: List<TruvideoSdkVideoRequest>): String {

    val jsonArray = JSONArray()

    for (request in requests) {

      val jsonString = returnRequest(request)

      try {

        val jsonObject = JSONObject(jsonString)

        jsonArray.put(jsonObject)

      } catch (e: Exception) {

        e.printStackTrace()

      }

    }

    return jsonArray.toString()

  }
  @ReactMethod
  fun cleanNoise(videoPath: String?, resultPath: String?, promise: Promise?) {
    if (videoPath == null || resultPath == null) {
      promise?.resolve("input path or result path not valid")
      return

    }

    if (videoPath.endsWith(".png") || videoPath.endsWith(".jpg") || videoPath.endsWith(".jpeg")) {
      promise?.resolve("video path must be video not image")
      return
    }
    try {
      scope.launch {
        val result =
          TruvideoSdkVideo.clearNoise(videoFile(videoPath), videoFileDescriptor(resultPath))
        promise?.resolve(result)
      }
      // Handle result

      // the cleaned video will be stored in resultVideoPath

    } catch (exception: Exception) {
      // Handle error
      promise?.reject("Exception", exception.message.toString())
      exception.printStackTrace()
    }

  }

  @ReactMethod
  fun editVideo(videoUri: String?, resultPath: String?, promise: Promise?) {
    if (videoUri!!.endsWith(".png") || videoUri.endsWith(".jpg") || videoUri.endsWith(".jpeg")) {
      promise?.resolve("video path must be video not image")
      return
    }
    mainPromise = promise
    currentActivity!!.startActivity(
      Intent(
        currentActivity,
        EditScreenActivity::class.java
      ).putExtra("videoUri", videoUri).putExtra("resultPath", resultPath)
    )
  }

  fun videoFile(inputPath: String): TruvideoSdkVideoFile {
    return TruvideoSdkVideoFile.custom(inputPath)
  }

  fun videoFileDescriptor(outputPath: String): TruvideoSdkVideoFileDescriptor {
    return TruvideoSdkVideoFileDescriptor.custom(outputPath)
  }

  fun listVideoFile(list: List<String>): List<TruvideoSdkVideoFile> {
    val listVideo = ArrayList<TruvideoSdkVideoFile>()
    list.forEach {
      listVideo.add(videoFile(it))
    }
    return listVideo
  }


  @ReactMethod
  fun concatVideos(videoUris: ReadableArray?, resultPath: String?, promise: Promise?) {
    try {
      if (videoUris == null || resultPath == null) {
        promise?.resolve("input path or result path not valid")
        return
      }

      val videoUriList = videoUris.toArrayList().map { it.toString() }
      videoUriList.forEach {
        if (it.endsWith(".png") || it.endsWith(".jpg") || it.endsWith(".jpeg")) {
          promise?.resolve("input path must be video not image")
          return
        }
      }

      val builder = TruvideoSdkVideo.ConcatBuilder(
        listVideoFile(videoUriList),
        videoFileDescriptor(resultPath)
      )
      scope.launch {
        val request = builder.build()
        promise!!.resolve(returnRequest(request))
      }
      // Handle result

      // the concat video its on 'resultVideoPath'
    } catch (exception: Exception) {
      // Handle error
      promise?.reject("Exception", exception.message!!)
      exception.printStackTrace()
    }
  }


  @ReactMethod
  fun changeEncoding(videoUri: String, resultPath: String, config: String, promise: Promise) {
    // Change encoding of video and save to resultPath
    // Build the encode builder
    val result = TruvideoSdkVideo.EncodeBuilder(
      videoFile(videoUri),
      videoFileDescriptor(resultPath)
    )
    val configuration = JSONObject(config)
    if (configuration.has("height")) {
      result.height = configuration.getInt("height")
    }
    if (configuration.has("width")) {
      result.width = configuration.getInt("width")
    }
    if (configuration.has("framesRate")) {
      when (configuration.getString("framesRate")) {
        "twentyFourFps" -> result.framesRate = TruvideoSdkVideoFrameRate.twentyFourFps
        "twentyFiveFps" -> result.framesRate = TruvideoSdkVideoFrameRate.twentyFiveFps
        "thirtyFps" -> result.framesRate = TruvideoSdkVideoFrameRate.thirtyFps
        "fiftyFps" -> result.framesRate = TruvideoSdkVideoFrameRate.fiftyFps
        "sixtyFps" -> result.framesRate = TruvideoSdkVideoFrameRate.sixtyFps
        else -> result.framesRate = TruvideoSdkVideoFrameRate.defaultFrameRate
      }
    }
//    if(configuration.has("videoCodec")){
//      when(configuration.getString("videoCodec")){
//        "h264" -> result.videoCodec = TruvideoSdkVideoVideoCodec.h264
//        "h265" -> result.videoCodec = TruvideoSdkVideoVideoCodec.h265
//        "libx264" -> result.videoCodec = TruvideoSdkVideoVideoCodec.libx264
//        else -> result.videoCodec = TruvideoSdkVideoVideoCodec.defaultCodec
//      }
//    }
    // Process the encode builder
    scope.launch {
      result.build().process()
      promise.resolve("encode success")
    }
  }

  @ReactMethod
  fun getVideoInfo(videoPath: String?, promise: Promise?) {
    if (videoPath == null) {
      promise?.resolve("input path is not valid")
      return
    }

    if (videoPath.endsWith(".png") || videoPath.endsWith(".jpg") || videoPath.endsWith(".jpeg")) {

      promise?.resolve("video path must be video not image")

    }

    try {

      scope.launch {

        val info = TruvideoSdkVideo.getInfo(videoFile(videoPath))

        val videoTracks = JSONArray()

        info.videoTracks.forEach {

          val videoTrack = JSONObject()

          videoTrack.put("index", it.index)

          videoTrack.put("width", it.width)

          videoTrack.put("height", it.height)

          videoTrack.put("rotatedWidth", it.rotatedWidth)

          videoTrack.put("rotatedHeight", it.rotatedHeight)

          videoTrack.put("codec", it.codec)

          videoTrack.put("codecTag", it.codecTag)

          videoTrack.put("pixelFormat", it.pixelFormat)

          videoTrack.put("bitRate", it.bitRate)

          videoTrack.put("frameRate", it.frameRate)

          videoTrack.put("rotation", it.rotation.name)

          videoTrack.put("durationMillis", it.durationMillis)

          videoTracks.put(videoTrack)

        }

        val audioTracks = JSONArray()

        info.audioTracks.forEach {

          val audioTrack = JSONObject()

          audioTrack.put("index", it.index)

          audioTrack.put("bitRate", it.bitRate)

          audioTrack.put("sampleRate", it.sampleRate)

          audioTrack.put("channels", it.channels)

          audioTrack.put("codec", it.codec)

          audioTrack.put("codecTag", it.codecTag)

          audioTrack.put("durationMillis", it.durationMillis)

          audioTrack.put("channelLayout", it.channelLayout)

          audioTrack.put("sampleFormat", it.sampleFormat)

          audioTracks.put(audioTrack)

        }

        val mainResponse = JSONObject().apply {

          put("path", info.path)

          put("size", info.size)

          put("durationMillis", info.durationMillis)

          put("format", info.format)

          put("videoTracks", videoTracks)

          put("audioTracks", audioTracks)

        }

        promise?.resolve(mainResponse.toString())

      }

    } catch (exception: Exception) {

      exception.printStackTrace()

      promise?.reject("Exception", exception.message.toString())

      // Handle error

    }

  }

  @ReactMethod
  fun getResultPath(path: String?, promise: Promise?) {
    val basePath = currentActivity!!.filesDir
    promise?.resolve(File("$basePath/camera/$path").path)
  }


  @ReactMethod
  fun compareVideos(videoUris: ReadableArray?, promise: Promise?) {

    if (videoUris == null) {
      promise?.resolve("input path or result path not valid")
      return
    }

    try {

      val videoUriList = videoUris.toArrayList().map { it.toString() }
      videoUriList.forEach {
        if (it.endsWith(".png") || it.endsWith(".jpg") || it.endsWith(".jpeg")) {
          promise?.resolve("input path must be video not image")
          return
        }
      }

      scope.launch {
        val result = TruvideoSdkVideo.compare(listVideoFile(videoUriList))
        promise?.resolve(result)
      }

    } catch (exception: Exception) {
      // Handle error
      promise?.reject("Exception", exception.message.toString())
      exception.printStackTrace()
    }
  }


  fun toastMessage(context: Context, message: String) {
    // Show toast message
    Handler(Looper.getMainLooper()).post {
      // Run on main thread
      Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
  }

  @ReactMethod
  fun mergeVideos(
    videoUris: ReadableArray?,
    resultPath: String?,
    config: String?,
    promise: Promise?
  ) {

    if (videoUris == null || resultPath == null) {

      promise?.resolve("input path or result path not valid")

      return

    }

    try {

      val videoUriList = videoUris.toArrayList().map { it.toString() }

      videoUriList.forEach {

        if (it.endsWith(".png") || it.endsWith(".jpg") || it.endsWith(".jpeg")) {

          promise?.resolve("input path must be video not image")

          return

        }

      }

      val builder =
        TruvideoSdkVideo.MergeBuilder(listVideoFile(videoUriList), videoFileDescriptor(resultPath))

      val configuration = JSONObject(config!!)

      if (configuration.has("height")) {

        builder.height = configuration.getInt("height")

      }

      if (configuration.has("width")) {

        builder.width = configuration.getInt("width")

      }

      if (configuration.has("framesRate")) {

        when (configuration.getString("framesRate")) {

          "twentyFourFps" -> builder.framesRate = TruvideoSdkVideoFrameRate.twentyFourFps

          "twentyFiveFps" -> builder.framesRate = TruvideoSdkVideoFrameRate.twentyFiveFps

          "thirtyFps" -> builder.framesRate = TruvideoSdkVideoFrameRate.thirtyFps

          "fiftyFps" -> builder.framesRate = TruvideoSdkVideoFrameRate.fiftyFps

          "sixtyFps" -> builder.framesRate = TruvideoSdkVideoFrameRate.sixtyFps

          else -> builder.framesRate = TruvideoSdkVideoFrameRate.defaultFrameRate

        }

      }

      scope.launch {

        val request = builder.build()

        promise?.resolve(returnRequest(request))

      }

      // Handle result

      // the merged video its on 'resultVideoPath'

    } catch (exception: Exception) {

      //Handle error

      promise?.reject(exception.message.toString(), exception)

      exception.printStackTrace()

    }

  }

  @ReactMethod
  fun generateThumbnail(
    videoPath: String?,
    resultPath: String?,
    position: String?,
    width: String?,
    height: String?,
    promise: Promise?
  ) {

    if (videoPath == null || resultPath == null) {

      promise?.reject("video path error", "input path or result path not valid")

      return

    }

    if (videoPath.endsWith(".png") || videoPath.endsWith(".jpg") || videoPath.endsWith(".jpeg")) {

      promise?.reject("video path error", "video path must be video not image")

      return

    }

    try {

      scope.launch {

        if (TruvideoSdkVideo.getInfo(videoFile(videoPath)).durationMillis < position!!.toLong()) {

          promise?.reject("position error", "position is less than video length")

        }

        val result = TruvideoSdkVideo.createThumbnail(

          videoFile(videoPath),

          videoFileDescriptor(resultPath),

          try {
            position.toLong()
          } catch (e: Exception) {

            Log.d("TAG", "position not valid: $e")

            "0".toLong()
          },

          try {
            width!!.toInt()
          } catch (e: Exception) {

            Log.d("TAG", "width not valid: $e")

            "0".toInt()
          }, // or null

          try {
            height!!.toInt()
          } catch (e: Exception) {

            Log.d("TAG", "height not valid: $e")

            "0".toInt()
          } // or null

        )

        promise?.resolve(result)

      }

    } catch (exception: Exception) {

      // Handle error

      promise?.reject("Exception", exception.message.toString())

      exception.printStackTrace()

    }

  }

}
