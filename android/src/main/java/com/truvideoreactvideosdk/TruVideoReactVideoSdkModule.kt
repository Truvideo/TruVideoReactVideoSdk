package com.truvideoreactvideosdk

import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.google.gson.Gson
import com.truvideo.sdk.video.TruvideoSdkVideo
import com.truvideo.sdk.video.interfaces.TruvideoSdkVideoCallback
import com.truvideo.sdk.video.model.TruvideoSdkVideoException
import com.truvideo.sdk.video.model.TruvideoSdkVideoFrameRate
import com.truvideo.sdk.video.model.TruvideoSdkVideoRequest
import com.truvideo.sdk.video.model.TruvideoSdkVideoVideoCodec
import com.truvideo.sdk.video.usecases.TruvideoSdkVideoEditScreen
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File

class TruVideoReactVideoSdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  val scope = CoroutineScope(Dispatchers.Main)
  val gson = Gson()
  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }


  companion object {
    const val NAME = "TruVideoReactVideoSdk"
    var mainPromise : Promise? = null
  }


  @ReactMethod
  fun concatVideos(videoUris: List<String>, resultPath: String,promise: Promise) {
    // concat videos and save to resultPath
    // Build the concat builder
    try {
      val builder = TruvideoSdkVideo.ConcatBuilder(videoUris, resultPath)
      scope.launch {
        val request = builder.build()
        request.process()
        promise.resolve(gson.toJson(request))
      }
      // Handle result
      // the concated video its on 'resultVideoPath'
    } catch (exception: Exception) {
      // Handle error
      promise.reject(exception.message)
      exception.printStackTrace()
    }

  }
  @ReactMethod
  fun changeEncoding(videoUri: String, resultPath: String,promise: Promise) {
    // Change encoding of video and save to resultPath
    // Build the encode builder
    val result = TruvideoSdkVideo.EncodeBuilder(videoUri, resultPath)
    result.height = 640
    result.width = 480
    result.framesRate = TruvideoSdkVideoFrameRate.fiftyFps
    result.videoCodec = TruvideoSdkVideoVideoCodec.h264


    // Process the encode builder
    result.build(object : TruvideoSdkVideoCallback<TruvideoSdkVideoRequest> {
      override fun onComplete(result: TruvideoSdkVideoRequest) {
        promise.resolve(result)
      }

      override fun onError(exception: TruvideoSdkVideoException) {
        promise.reject(exception.message)
      }
    })
  }
  @ReactMethod
  fun getVideoInfo(videoPath: String,promise: Promise) {
    try {
      scope.launch {
        val info = TruvideoSdkVideo.getInfo(videoPath)
        promise.resolve(gson.toJson(info))
      }
    } catch (exception: Exception) {
      exception.printStackTrace()
      promise.reject(exception.message)
      // Handle error
    }
  }

  @ReactMethod
  fun getResultPath(fileName: String): String {
      // get result path with dynamic name
      return File("/data/user/0/com.example.sampletruvideo/files/truvideo-sdk/camera/$fileName").path
  }


  @ReactMethod
  fun compareVideos( videoUris: List<String>,promise: Promise) {
    // compare videos and return true or false if they are ready to conca
    try {
      scope.launch {
        val result = TruvideoSdkVideo.compare(videoUris)
        promise.resolve(result)
      }
    } catch (exception: Exception) {
      // Handle error
      promise.reject(exception.message)
      exception.printStackTrace()
    }
  }
  @ReactMethod
  fun editVideo(videoUri: String, resultPath: String,promise: Promise) {
    mainPromise = promise
    reactApplicationContext.startActivity(Intent(reactApplicationContext, EditScreenActivity::class.java).putExtra("videoUri", videoUri).putExtra("resultPath", resultPath))
  }

  fun toastMessage(context: Context, message: String) {
    // Show toast message
    Handler(Looper.getMainLooper()).post {
      // Run on main thread
      Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
  }

  @ReactMethod
  fun mergeVideos( videoUris: ReadableArray, resultPath: String,promise: Promise) {

    val videoUri = ArrayList<String>()
    for (i in 0 until videoUris.size()) {
      videoUri.add(videoUris.getString(i))
    }
    // merge videos and save to resultPath the can be of any format
    // Build the merge builder
    try{
      val builder = TruvideoSdkVideo.MergeBuilder(videoUri, resultPath)
      scope.launch {
        val request = builder.build()
        request.process()
        promise.resolve(gson.toJson(request))
      }
      // Handle result
      // the merged video its on 'resultVideoPath'
    }catch (exception:Exception){
      //Handle error
      promise.reject(exception.message)
      exception.printStackTrace()
    }
  }

  @ReactMethod
  fun getAllRequest(promise: Promise) {
    // Get all request
    scope.launch {
      val result = TruvideoSdkVideo.getAllRequests()
      promise.resolve(gson.toJson(result))
    }
  }
  @ReactMethod
    fun generateThumbnail(videoPath: String, resultPath: String,promise: Promise) {
    try {
      scope.launch {
        val result = TruvideoSdkVideo.createThumbnail(
          videoPath = videoPath,
          resultPath = resultPath,
          position = 1000,
          width = 300, // or null
          height = 300 // or null
        )
        promise.resolve(result)
      }
//      setThumbnail(context,videoPath,resultPath)

      // Handle result
      // the thumbnail image is stored in resultImagePath
    } catch (exception: Exception) {
      // Handle error
      promise.reject(exception.message)
      exception.printStackTrace()
    }

  }
  @ReactMethod
  fun cleanNoise(videoPath: String, resultPath: String,promise: Promise) {
    // Clean noise from video and save to resultPath
    try{
      scope.launch {
        val result = TruvideoSdkVideo.clearNoise(videoPath, resultPath)
        promise.resolve(result)
      }
      // Handle result
      // the cleaned video will be stored in resultVideoPath
    }catch (exception:Exception){
      // Handle error
      promise.reject(exception.message)
      exception.printStackTrace()
    }
  }
}
