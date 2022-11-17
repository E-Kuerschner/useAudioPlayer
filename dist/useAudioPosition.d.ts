interface UseAudioPositionConfig {
    highRefreshRate?: boolean;
}
interface AudioPosition {
    position: number;
    duration: number;
    percentComplete: number;
    seek: (position: number) => number;
    speed: (rate: number | undefined) => number | undefined;
}
export declare const useAudioPosition: (config?: UseAudioPositionConfig) => AudioPosition;
export {};
