enum AudioEvent {
    //% block="Starts Playing"
    StartedPlaying,
    //% block="Stops Playing"
    StoppedPlaying,
    //% block="Starts Recording"
    StartedRecording,
    //% block="Stops Recording"
    StoppedRecording
}

enum AudioSampleRateScope {
    Everything,
    Playback,
    Recording
}

enum AudioGainEnum {
    Low,
    Medium,
    High
}

/**
 * Functions to operate the v2 on-board microphone and speaker.
 */
//% weight=5 color=#e26fb4 icon="\uf130" block="V2 Audio" advanced=false
namespace codalAudio {

    // Shim state
    let _recordingFreqHz: number = 22000
    let _playbackFreqHz: number = 22000
    let _micGain: AudioGainEnum = AudioGainEnum.Medium

    /*let _memoryFill:      number        = 0

    setInterval( () => {
        if( _memoryFill < 100 )
            _memoryFill++
        console.log( _memoryFill )
    }, 100 )*/

    /**
     * Record an audio clip
     * 
     * @param sync If true, block until we run out of memory!
     */
    //% block="start recording"
    //% shim=codalAudio::record
    export function record(): void {
        /* Dummy function */
        console.log("CodalAudio -> record()")
        return
    }

    /**
     * Set the sample rate for recording, playback, or both
     * 
     * @param hz The sample rate, in Hz
     */
    //% block="⚠️ set sample rate to %hz Hz || for %scope"
    //% expandableArgumentMode="enabled"
    //% hz.defl=22000
    export function setSampleRate(hz: number, scope?: AudioSampleRateScope): void {
        switch (scope) {
            case AudioSampleRateScope.Everything:
                _recordingFreqHz = hz;
                _playbackFreqHz = hz;
                break;

            case AudioSampleRateScope.Playback:
                _playbackFreqHz = hz;
                break;

            case AudioSampleRateScope.Recording:
                _recordingFreqHz = hz;
                break;
        }
    }

    /**
     * Set the microphone gain. High values can cause distortion!
     * 
     * @param gain The gain to use.
     */
    //% block="set microphone gain to %gain"
    //% gain.defl=Medium
    export function setMicrophoneGain(gain: AudioGainEnum): void {
        /* Dummy function */
        _micGain = gain;
        return
    }

    /**
     * Play any recorded audio
     * 
     * @param sync If true, block until complete
     */
    //% block="​start playback"
    //% shim=codalAudio::play
    export function play(): void {
        /* Dummy function */
        console.log("CodalAudio -> play()")
        return
    }

    /**
     * Play and recorded audio
     */
    //% block="stop"
    //% shim=codalAudio::stop
    export function stop(): void {
        /* Dummy function */
        console.log("CodalAudio -> stop()")
        return
    }

    /**
     * Play and recorded audio
     */
    //% block="erase recording"
    //% shim=codalAudio::erase
    export function erase(): void {
        /* Dummy function */
        console.log("CodalAudio -> erase()")
        return
    }

    //% block="microphone gain"
    export function micGain(): AudioGainEnum {
        return _micGain;
    }

    //% block="recording frequency"
    export function recordingHz(): number {
        return _recordingFreqHz;
    }

    //% block="playback frequency"
    export function playbackHz(): number {
        return _playbackFreqHz;
    }

    //% block="audio duration at %hz hz"
    //% shim=codalAudio::audioDiration
    export function audioDuration(hz?: number): number {
        return 3;
    }

    //% block="audio is playing"
    //% shim=codalAudio::audioIsPlaying
    export function audioIsPlaying(): boolean {
        return false;
    }

    //% block="audio is recording"
    //% shim=codalAudio::audioIsRecording
    export function audioIsRecording(): boolean {
        return false;
    }

    //% block="audio is stopped"
    //% shim=codalAudio::audioIsStopped
    export function audioIsStopped(): boolean {
        return false;
    }

    //% block="⚠️ when audio %eventType"
    export function audioEvent(eventType: AudioEvent, handler: () => void): void {
        /* Dummy function */
        console.log("CodalAudio -> audioEvent()")
        return
    }


}