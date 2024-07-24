import { NativeModules } from 'react-native';
import {
  concatVideos,
  encodeVideo,
  getVideoInfo,
  compareVideos,
  mergeVideos,
  generateThumbnail,
  cleanNoise,
  editVideo,
  getResultPath,
} from '../index';

jest.mock('react-native', () => ({
  NativeModules: {
    TruVideoReactVideoSdk: {
      concatVideos: jest.fn(),
      changeEncoding: jest.fn(),
      getVideoInfo: jest.fn(),
      compareVideos: jest.fn(),
      mergeVideos: jest.fn(),
      generateThumbnail: jest.fn(),
      cleanNoise: jest.fn(),
      editVideo: jest.fn(),
      getResultPath: jest.fn(),
    },
  },
  Platform: {
    select: jest.fn().mockImplementation((objs) => objs.default),
  },
}));

describe('TruVideoReactVideoSdk', () => {
  describe('concatVideos', () => {
    const mockVideoUris = ['/path/to/video1', '/path/to/video2'];
    const mockResultPath = '/path/to/result/video';
    const mockResponse = 'mockConcatResponse';

    beforeEach(() => {
      (
        NativeModules.TruVideoReactVideoSdk.concatVideos as jest.Mock
      ).mockClear();
    });

    it('calls TruVideoReactVideoSdk.concatVideos with correct arguments and returns response', async () => {
      (
        NativeModules.TruVideoReactVideoSdk.concatVideos as jest.Mock
      ).mockResolvedValue(mockResponse);
      const result = await concatVideos(mockVideoUris, mockResultPath);
      expect(
        NativeModules.TruVideoReactVideoSdk.concatVideos
      ).toHaveBeenCalledWith(mockVideoUris, mockResultPath);
      expect(result).toBe(mockResponse);
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('mock error');
      (
        NativeModules.TruVideoReactVideoSdk.concatVideos as jest.Mock
      ).mockRejectedValue(mockError);
      await expect(concatVideos(mockVideoUris, mockResultPath)).rejects.toThrow(
        'mock error'
      );
      expect(
        NativeModules.TruVideoReactVideoSdk.concatVideos
      ).toHaveBeenCalledWith(mockVideoUris, mockResultPath);
    });
  });

  describe('encodeVideo', () => {
    const mockVideoUri = '/path/to/video';
    const mockResultPath = '/path/to/result/video';
    const mockConfig = '{"bitrate": "500k"}';
    const mockResponse = 'mockEncodedResponse';

    beforeEach(() => {
      (
        NativeModules.TruVideoReactVideoSdk.changeEncoding as jest.Mock
      ).mockClear();
    });

    it('calls TruVideoReactVideoSdk.changeEncoding with correct arguments and returns response', async () => {
      (
        NativeModules.TruVideoReactVideoSdk.changeEncoding as jest.Mock
      ).mockResolvedValue(mockResponse);
      const result = await encodeVideo(
        mockVideoUri,
        mockResultPath,
        mockConfig
      );
      expect(
        NativeModules.TruVideoReactVideoSdk.changeEncoding
      ).toHaveBeenCalledWith(mockVideoUri, mockResultPath, mockConfig);
      expect(result).toBe(mockResponse);
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('mock error');
      (
        NativeModules.TruVideoReactVideoSdk.changeEncoding as jest.Mock
      ).mockRejectedValue(mockError);
      await expect(
        encodeVideo(mockVideoUri, mockResultPath, mockConfig)
      ).rejects.toThrow('mock error');
      expect(
        NativeModules.TruVideoReactVideoSdk.changeEncoding
      ).toHaveBeenCalledWith(mockVideoUri, mockResultPath, mockConfig);
    });
  });

  describe('getVideoInfo', () => {
    const mockVideoPath = '/path/to/video';
    const mockResponse = 'mockVideoInfo';

    beforeEach(() => {
      (
        NativeModules.TruVideoReactVideoSdk.getVideoInfo as jest.Mock
      ).mockClear();
    });

    it('calls TruVideoReactVideoSdk.getVideoInfo with correct arguments and returns response', async () => {
      (
        NativeModules.TruVideoReactVideoSdk.getVideoInfo as jest.Mock
      ).mockResolvedValue(mockResponse);
      const result = await getVideoInfo(mockVideoPath);
      expect(
        NativeModules.TruVideoReactVideoSdk.getVideoInfo
      ).toHaveBeenCalledWith(mockVideoPath);
      expect(result).toBe(mockResponse);
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('mock error');
      (
        NativeModules.TruVideoReactVideoSdk.getVideoInfo as jest.Mock
      ).mockRejectedValue(mockError);
      await expect(getVideoInfo(mockVideoPath)).rejects.toThrow('mock error');
      expect(
        NativeModules.TruVideoReactVideoSdk.getVideoInfo
      ).toHaveBeenCalledWith(mockVideoPath);
    });
  });

  describe('compareVideos', () => {
    const mockVideoUris = ['/path/to/video1', '/path/to/video2'];
    const mockResponse = 'mockComparisonResult';

    beforeEach(() => {
      (
        NativeModules.TruVideoReactVideoSdk.compareVideos as jest.Mock
      ).mockClear();
    });

    it('calls TruVideoReactVideoSdk.compareVideos with correct arguments and returns response', async () => {
      (
        NativeModules.TruVideoReactVideoSdk.compareVideos as jest.Mock
      ).mockResolvedValue(mockResponse);
      const result = await compareVideos(mockVideoUris);
      expect(
        NativeModules.TruVideoReactVideoSdk.compareVideos
      ).toHaveBeenCalledWith(mockVideoUris);
      expect(result).toBe(mockResponse);
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('mock error');
      (
        NativeModules.TruVideoReactVideoSdk.compareVideos as jest.Mock
      ).mockRejectedValue(mockError);
      await expect(compareVideos(mockVideoUris)).rejects.toThrow('mock error');
      expect(
        NativeModules.TruVideoReactVideoSdk.compareVideos
      ).toHaveBeenCalledWith(mockVideoUris);
    });
  });

  describe('mergeVideos', () => {
    const mockVideoUris = ['/path/to/video1', '/path/to/video2'];
    const mockResultPath = '/path/to/result/video';
    const mockConfig = '{"bitrate": "500k"}';
    const mockResponse = 'mockMergedResult';

    beforeEach(() => {
      (
        NativeModules.TruVideoReactVideoSdk.mergeVideos as jest.Mock
      ).mockClear();
    });

    it('calls TruVideoReactVideoSdk.mergeVideos with correct arguments and returns response', async () => {
      (
        NativeModules.TruVideoReactVideoSdk.mergeVideos as jest.Mock
      ).mockResolvedValue(mockResponse);
      const result = await mergeVideos(
        mockVideoUris,
        mockResultPath,
        mockConfig
      );
      expect(
        NativeModules.TruVideoReactVideoSdk.mergeVideos
      ).toHaveBeenCalledWith(mockVideoUris, mockResultPath, mockConfig);
      expect(result).toBe(mockResponse);
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('mock error');
      (
        NativeModules.TruVideoReactVideoSdk.mergeVideos as jest.Mock
      ).mockRejectedValue(mockError);
      await expect(
        mergeVideos(mockVideoUris, mockResultPath, mockConfig)
      ).rejects.toThrow('mock error');
      expect(
        NativeModules.TruVideoReactVideoSdk.mergeVideos
      ).toHaveBeenCalledWith(mockVideoUris, mockResultPath, mockConfig);
    });
  });

  describe('generateThumbnail', () => {
    const mockVideoPath = '/path/to/video';
    const mockResultPath = '/path/to/result/thumbnail';
    const mockPosition = '00:00:10';
    const mockWidth = '100';
    const mockHeight = '100';
    const mockResponse = 'mockThumbnailPath';

    beforeEach(() => {
      (
        NativeModules.TruVideoReactVideoSdk.generateThumbnail as jest.Mock
      ).mockClear();
    });

    it('calls TruVideoReactVideoSdk.generateThumbnail with correct arguments and returns response', async () => {
      (
        NativeModules.TruVideoReactVideoSdk.generateThumbnail as jest.Mock
      ).mockResolvedValue(mockResponse);
      const result = await generateThumbnail(
        mockVideoPath,
        mockResultPath,
        mockPosition,
        mockWidth,
        mockHeight
      );
      expect(
        NativeModules.TruVideoReactVideoSdk.generateThumbnail
      ).toHaveBeenCalledWith(
        mockVideoPath,
        mockResultPath,
        mockPosition,
        mockWidth,
        mockHeight
      );
      expect(result).toBe(mockResponse);
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('mock error');
      (
        NativeModules.TruVideoReactVideoSdk.generateThumbnail as jest.Mock
      ).mockRejectedValue(mockError);
      await expect(
        generateThumbnail(
          mockVideoPath,
          mockResultPath,
          mockPosition,
          mockWidth,
          mockHeight
        )
      ).rejects.toThrow('mock error');
      expect(
        NativeModules.TruVideoReactVideoSdk.generateThumbnail
      ).toHaveBeenCalledWith(
        mockVideoPath,
        mockResultPath,
        mockPosition,
        mockWidth,
        mockHeight
      );
    });
  });

  describe('cleanNoise', () => {
    const mockVideoPath = '/path/to/video';
    const mockResultPath = '/path/to/result/cleanedVideo';
    const mockResponse = 'mockCleanedPath';

    beforeEach(() => {
      (NativeModules.TruVideoReactVideoSdk.cleanNoise as jest.Mock).mockClear();
    });

    it('calls TruVideoReactVideoSdk.cleanNoise with correct arguments and returns response', async () => {
      (
        NativeModules.TruVideoReactVideoSdk.cleanNoise as jest.Mock
      ).mockResolvedValue(mockResponse);
      const result = await cleanNoise(mockVideoPath, mockResultPath);
      expect(
        NativeModules.TruVideoReactVideoSdk.cleanNoise
      ).toHaveBeenCalledWith(mockVideoPath, mockResultPath);
      expect(result).toBe(mockResponse);
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('mock error');
      (
        NativeModules.TruVideoReactVideoSdk.cleanNoise as jest.Mock
      ).mockRejectedValue(mockError);
      await expect(cleanNoise(mockVideoPath, mockResultPath)).rejects.toThrow(
        'mock error'
      );
      expect(
        NativeModules.TruVideoReactVideoSdk.cleanNoise
      ).toHaveBeenCalledWith(mockVideoPath, mockResultPath);
    });
  });

  describe('editVideo', () => {
    const mockVideoUri = '/path/to/video';
    const mockResultPath = '/path/to/result/editedVideo';
    const mockResponse = 'mockEditedPath';

    beforeEach(() => {
      (NativeModules.TruVideoReactVideoSdk.editVideo as jest.Mock).mockClear();
    });

    it('calls TruVideoReactVideoSdk.editVideo with correct arguments and returns response', async () => {
      (
        NativeModules.TruVideoReactVideoSdk.editVideo as jest.Mock
      ).mockResolvedValue(mockResponse);
      const result = await editVideo(mockVideoUri, mockResultPath);
      expect(
        NativeModules.TruVideoReactVideoSdk.editVideo
      ).toHaveBeenCalledWith(mockVideoUri, mockResultPath);
      expect(result).toBe(mockResponse);
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('mock error');
      (
        NativeModules.TruVideoReactVideoSdk.editVideo as jest.Mock
      ).mockRejectedValue(mockError);
      await expect(editVideo(mockVideoUri, mockResultPath)).rejects.toThrow(
        'mock error'
      );
      expect(
        NativeModules.TruVideoReactVideoSdk.editVideo
      ).toHaveBeenCalledWith(mockVideoUri, mockResultPath);
    });
  });

  describe('getResultPath', () => {
    const mockPath = '/path/to/input';
    const mockResponse = '/path/to/result';

    beforeEach(() => {
      (
        NativeModules.TruVideoReactVideoSdk.getResultPath as jest.Mock
      ).mockClear();
    });

    it('calls TruVideoReactVideoSdk.getResultPath with correct arguments and returns response', async () => {
      (
        NativeModules.TruVideoReactVideoSdk.getResultPath as jest.Mock
      ).mockResolvedValue(mockResponse);
      const result = await getResultPath(mockPath);
      expect(
        NativeModules.TruVideoReactVideoSdk.getResultPath
      ).toHaveBeenCalledWith(mockPath);
      expect(result).toBe(mockResponse);
    });

    it('handles errors correctly', async () => {
      const mockError = new Error('mock error');
      (
        NativeModules.TruVideoReactVideoSdk.getResultPath as jest.Mock
      ).mockRejectedValue(mockError);
      await expect(getResultPath(mockPath)).rejects.toThrow('mock error');
      expect(
        NativeModules.TruVideoReactVideoSdk.getResultPath
      ).toHaveBeenCalledWith(mockPath);
    });
  });
});
