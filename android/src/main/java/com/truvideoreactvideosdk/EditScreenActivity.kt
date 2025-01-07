package com.truvideoreactvideosdk

import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.ActivityResultLauncher
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.truvideo.sdk.video.model.TruvideoSdkVideoFile
import com.truvideo.sdk.video.model.TruvideoSdkVideoFileDescriptor
import com.truvideo.sdk.video.ui.activities.edit.TruvideoSdkVideoEditContract
import com.truvideo.sdk.video.ui.activities.edit.TruvideoSdkVideoEditParams
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class EditScreenActivity : AppCompatActivity() {
  private lateinit var editVideoLauncher: ActivityResultLauncher<TruvideoSdkVideoEditParams>
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
//        val editScreen = TruvideoSdkVideo.initEditScreen(this)
        editVideoLauncher = registerForActivityResult(TruvideoSdkVideoEditContract(), { result ->
          // edited video its on 'resultPath'
          TruVideoReactVideoSdkModule.mainPromise!!.resolve(result)
          finish()
          Log.d("TAG", "editVideo: result=$result")
        })

        CoroutineScope(Dispatchers.Main).launch {
            editVideo(videoUri!!,resultPath!!)
          }
    }
  suspend fun editVideo(videoUri: String, resultPath: String) {
    // Edit video and save to resultPath
    val input = TruvideoSdkVideoFile.custom(videoUri)
    val output = TruvideoSdkVideoFileDescriptor.custom(resultPath)
    editVideoLauncher.launch(
      TruvideoSdkVideoEditParams(
        input = input,
        output = output
      )
    )

  }
}
