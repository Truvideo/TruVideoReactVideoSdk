require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
# folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

repair_versioned_framework_symlinks = lambda do |framework_dir|
  versions_dir = File.join(framework_dir, "Versions")
  next unless Dir.exist?(versions_dir)

  current = File.join(versions_dir, "Current")
  version = File.exist?(current) ? File.readlink(current) : "A"
  version_dir = File.join(versions_dir, version)
  next unless Dir.exist?(version_dir)

  framework_name = File.basename(framework_dir, ".framework")
  symlinks = {
    framework_name => File.join("Versions", version, framework_name),
    "Headers" => File.join("Versions", version, "Headers"),
    "Modules" => File.join("Versions", version, "Modules"),
    "Resources" => File.join("Versions", version, "Resources"),
  }

  symlinks.each do |name, target|
    path = File.join(framework_dir, name)
    next if File.exist?(path) || File.symlink?(path)

    File.symlink(target, path)
  end

  File.symlink(version, current) unless File.exist?(current) || File.symlink?(current)
end

Dir.glob(File.join(__dir__, "ios", "xcframeworks", "*.xcframework", "ios-arm64_x86_64-maccatalyst", "*.framework")).each do |framework_dir|
  repair_versioned_framework_symlinks.call(framework_dir)
end

Pod::Spec.new do |s|
  s.name         = "truvideo-react-video-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/akshay2801-rgb/TruVideoReactVideoSdk.git", :tag => "#{s.version}" }

  s.static_framework = true
  s.swift_version = "5.0"

  # s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.source_files = [
  "ios/*.{h,m,mm,swift}",
  "ios/Classes/**/*.{h,m,mm,swift}"
]
#   s.exclude_files = [
#   "ios/xcframeworks/**/*"
# ]

s.public_header_files = [
  "ios/*.h",
  "ios/Classes/**/*.h"
]

  # s.dependency "truvideo-sdk-video" ,'78.1.2'
  # s.dependency 'truvideo-sdk-core/Video', '79.0.1'
  s.vendored_frameworks = [
    'ios/xcframeworks/ffmpegkit.xcframework',
    'ios/xcframeworks/libavcodec.xcframework',
    'ios/xcframeworks/libavdevice.xcframework',
    'ios/xcframeworks/libavfilter.xcframework',
    'ios/xcframeworks/libavformat.xcframework',
    'ios/xcframeworks/libavutil.xcframework',
    'ios/xcframeworks/libswresample.xcframework',
    'ios/xcframeworks/libswscale.xcframework',
    'ios/xcframeworks/TruvideoSdkVideo.xcframework',
  ]

  s.preserve_paths = [
  "ios/xcframeworks/**/*"
]

   # ✅ KEY FIX — exclude maccatalyst at build time for pod target
# ✅ KEY FIX — exclude maccatalyst at build time for pod target
 s.pod_target_xcconfig = {
  "EXCLUDED_ARCHS[sdk=maccatalyst*]" => "arm64 x86_64",
  # "SUPPORTS_MACCATALYST" => "NO",
  "DEFINES_MODULE" => "YES",
  "CLANG_CXX_LANGUAGE_STANDARD" => "c++20",
  "CLANG_CXX_LIBRARY" => "libc++",
  "OTHER_LDFLAGS" => "$(inherited) -lc++"
}

  # ✅ KEY FIX — propagate same restriction to the app target
  s.user_target_xcconfig = {
    "EXCLUDED_ARCHS[sdk=maccatalyst*]"       => "arm64 x86_64",
    # "SUPPORTS_MACCATALYST"                   => "NO",

     # IMPORTANT FIXES
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20",
    "CLANG_CXX_LIBRARY" => "libc++",

    "OTHER_LDFLAGS" => "$(inherited) -lc++"
  }
  
  s.dependency "truvideo-react-core-sdk"
 
  # Use install_modules_dependencies helper to install the dependencies if React Native version >=0.71.0.
  # See https://github.com/facebook/react-native/blob/febf6b7f33fdb4904669f99d795eba4c0f95d7bf/scripts/cocoapods/new_architecture.rb#L79.
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
    s.dependency "React-RCTBridge"
    s.dependency "ReactCommon"
    # Don't install the dependencies when we run `pod install` in the old architecture.
    # if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    #   s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
    #   s.pod_target_xcconfig    = {
    #       "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
    #       "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
    #       "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    #   }
    #   s.dependency "React-Codegen"
    #   s.dependency "RCT-Folly"
    #   s.dependency "RCTRequired"
    #   s.dependency "RCTTypeSafety"
    #   s.dependency "ReactCommon/turbomodule/core"
    # end
  end
end
