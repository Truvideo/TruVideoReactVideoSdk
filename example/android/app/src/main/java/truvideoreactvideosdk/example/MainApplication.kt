package truvideoreactvideosdk.example

import android.app.Application
import androidx.multidex.MultiDex
import androidx.multidex.MultiDexApplication
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

class MainApplication : MultiDexApplication(), ReactApplication {

  // Track whether new architecture libraries are actually available
  // This is set to false if the library load fails, even if BuildConfig says it's enabled
  private var newArchLibrariesAvailable = false

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        // Explicitly return null for getJSBundleFile to force Metro bundler usage in debug mode
        // This ensures the app always tries to load from Metro instead of looking for bundled assets
        override fun getJSBundleFile(): String? {
          return if (BuildConfig.DEBUG) {
            null // Return null to use Metro bundler
          } else {
            super.getJSBundleFile() // Use bundled assets in release mode
          }
        }

        // Override isNewArchEnabled to return false if libraries aren't available
        // This prevents React Native from trying to use new architecture classes
        // when the native libraries are missing, even if BuildConfig says it's enabled
        // Use a getter so it's evaluated each time it's accessed, not just at object creation
        override val isNewArchEnabled: Boolean
          get() = newArchLibrariesAvailable && BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    // MultiDex.install() is automatically called by MultiDexApplication in attachBaseContext
    
    // CRITICAL: Check BuildConfig.IS_NEW_ARCHITECTURE_ENABLED first and set flag immediately
    // This must happen before SoLoader.init() to prevent ReactActivityDelegate from trying
    // to enable bridgeless architecture when it shouldn't
    if (!BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      newArchLibrariesAvailable = false
      android.util.Log.d("MainApplication", "New Architecture is disabled in BuildConfig")
    }
    
    // Use OpenSourceMergedSoMapping for React Native 0.76+ to handle merged native libraries
    // This helps resolve libraries like libreact_featureflagsjni.so even when they're merged
    try {
      SoLoader.init(this, OpenSourceMergedSoMapping)
    } catch (e: Exception) {
      // Fallback to false if OpenSourceMergedSoMapping is not available (older RN versions)
      android.util.Log.w("MainApplication", "OpenSourceMergedSoMapping not available, using default SoLoader init", e)
      SoLoader.init(this, false)
    }
    
    // Only load new architecture if it's enabled AND the required libraries are available
    // This check prevents crashes when BuildConfig.IS_NEW_ARCHITECTURE_ENABLED is true
    // but the native libraries weren't built (e.g., due to stale build cache or React Native plugin bug)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      try {
        // If you opted-in for the New Architecture, we load the native entry point for this app.
        load()
        // If load() succeeds, mark that new architecture libraries are available
        newArchLibrariesAvailable = true
        android.util.Log.d("MainApplication", "New Architecture libraries loaded successfully")
      } catch (e: UnsatisfiedLinkError) {
        // If the new architecture libraries are not available, this indicates a build configuration mismatch.
        // The BuildConfig says new architecture is enabled, but the native libraries weren't built.
        // This typically happens when:
        // 1. Build cache is stale - solution: clean and rebuild
        // 2. gradle.properties has newArchEnabled=false but BuildConfig wasn't regenerated
        // 3. React Native Gradle plugin bug where it sets BuildConfig incorrectly
        // 
        // Set newArchLibrariesAvailable to false so isNewArchEnabled returns false
        // This prevents React Native from trying to use new architecture classes
        newArchLibrariesAvailable = false
        android.util.Log.w(
          "MainApplication",
          "New Architecture is enabled in BuildConfig but required native libraries are missing. " +
          "Disabling new architecture. This is safe if newArchEnabled=false in gradle.properties. " +
          "Error: ${e.message}",
          e
        )
        // Don't throw - allow app to continue without new architecture
        // This is safe because if newArchEnabled=false, the app should work fine without it
      } catch (e: Exception) {
        // Catch any other exceptions during load()
        newArchLibrariesAvailable = false
        android.util.Log.e(
          "MainApplication",
          "Failed to load New Architecture libraries: ${e.message}",
          e
        )
      }
    } else {
      // BuildConfig says new architecture is disabled, so libraries aren't available
      newArchLibrariesAvailable = false
    }
  }
}
