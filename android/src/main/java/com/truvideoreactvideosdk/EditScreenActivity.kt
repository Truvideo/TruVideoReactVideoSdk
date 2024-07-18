package com.truvideoreactvideosdk

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.ReactMethod
import com.truvideo.sdk.video.TruvideoSdkVideo
import com.truvideo.sdk.video.usecases.TruvideoSdkVideoEditScreen
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
        val editScreen = TruvideoSdkVideo.initEditScreen(this)
        CoroutineScope(Dispatchers.Main).launch {
          editVideo(videoUri!!,resultPath!!,editScreen)
        }
    }
  suspend fun editVideo(videoUri: String, resultPath: String,editScreen: TruvideoSdkVideoEditScreen) {
    // Edit video and save to resultPath
    val result = editScreen.open(videoUri, resultPath)
    TruVideoReactVideoSdkModule.mainPromise!!.resolve(result)
    finish()
    Log.d("TAG", "editVideo: result=$result")
  }
}
