package com.truvideoreactvideosdk

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.ActivityResultLauncher
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ReactMethod
import com.truvideo.sdk.video.TruvideoSdkVideo
import com.truvideo.sdk.video.model.TruvideoSdkVideoFile
import com.truvideo.sdk.video.model.TruvideoSdkVideoFileDescriptor
import com.truvideo.sdk.video.ui.activities.edit.TruvideoSdkVideoEditContract
import com.truvideo.sdk.video.ui.activities.edit.TruvideoSdkVideoEditParams
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class EditScreenActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_edit_screen)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        val videoUri = intent.getStringExtra("videoUri")
        val resultPath = intent.getStringExtra("resultPath")
        val editScreen = registerForActivityResult(TruvideoSdkVideoEditContract()){
          TruVideoReactVideoSdkModule.mainPromise!!.resolve(it)
        }
        CoroutineScope(Dispatchers.Main).launch {
          editVideo(videoUri!!,resultPath!!,editScreen)
        }
    }
  suspend fun editVideo(videoUri: String, resultPath: String,editScreen: ActivityResultLauncher<TruvideoSdkVideoEditParams>) {
    // Edit video and save to resultPath
    val result = editScreen.launch(
      TruvideoSdkVideoEditParams(
        TruvideoSdkVideoFile.custom(videoUri),
        TruvideoSdkVideoFileDescriptor.custom(resultPath)
      )
    )
    finish()
    Log.d("TAG", "editVideo: result=$result")
  }
}
