# truvideo-react-video-sdk

none

## Installation

```sh
"dependencies": {
  // replace token with your personal access token
    "truvideo-react-video-sdk": "git+https://<token>@github.com/Truvideo/TruVideoReactVideoSdk.git#release-version-76"
}

//or
npm install truvideo-react-video-sdk
```

## Usage


```js
import { generateThumbnail,cleanNoise,editVideo,getResultPath,concatVideos,encodeVideo,getVideoInfo,compareVideos,mergeVideos } from 'truvideo-react-video-sdk';

// ...

generateThumbnail(videoPath: string, resultPath: string,position: string,width: string,height: string)
      .then((result) => {
        console.log('result', result);
      })
      .catch((error) => {
        console.log('error', error);
      });

cleanNoise(videoPath: string,resultPath: string)
      .then((result) => {
              console.log('result', result);
            })
            .catch((error) => {
              console.log('error', error);
            });

editVideo(videoPath: string,resultPath: string)
      .then((result) => {
              console.log('result', result);
            })
            .catch((error) => {
              console.log('error', error);
            });

getResultPath(videoPath: string)
      .then((result) => {
              console.log('result', result);
            })
            .catch((error) => {
              console.log('error', error);
            });

concatVideos(videoUris: string[],resultPath: string)
      .then((result) => {
              console.log('result', result);
            })
            .catch((error) => {
              console.log('error', error);
            });

encodeVideo(videoUri: string,resultPath: string,config: string)
       .then((result) => {
              console.log('result', result);
            })
            .catch((error) => {
              console.log('error', error);
            });

getVideoInfo(videoPath: string)
      .then((result) => {
              console.log('result', result);
            })
            .catch((error) => {
              console.log('error', error);
            });

compareVideos(videoUris: string[])
      .then((result) => {
              console.log('result', result);
            })
            .catch((error) => {
              console.log('error', error);
            });

mergeVideos( videoUris: string[],resultPath: string,config: string)
       .then((result) => {
              console.log('result', result);
            })
            .catch((error) => {
              console.log('error', error);
            });

```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
