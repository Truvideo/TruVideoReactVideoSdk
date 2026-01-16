# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep Kotlin time classes (kotlin.time.Clock.System and related)
-keep class kotlin.time.** { *; }
-keep class kotlin.time.Clock { *; }
-keep class kotlin.time.Clock$System { *; }
-dontwarn kotlin.time.**

# Keep Kotlin stdlib classes
-keep class kotlin.** { *; }
-dontwarn kotlin.**
