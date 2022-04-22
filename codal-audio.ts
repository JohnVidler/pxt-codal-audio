enum WaitOpts {
    Foreground,
    Background
}

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

enum SampleRateScope {
    Everything,
    Playback,
    Recording
}

/**
 * Functions to operate the v2 on-board microphone and speaker.
 */
//% weight=5 color=#e26fb4 icon="\uf130" block="V2 Audio" advanced=false
namespace codalAudio {

    /**
     * Record an audio clip
     * 
     * @param sync If true, block until we run out of memory!
     */
    //% block="​⏺️ Start recording"
    export function record() : void {
        /* Dummy function */
    }

    /**
     * Set the sample rate for recording, playback, or both
     * 
     * @param hz The sample rate, in Hz
     */
    //% block="Set sample rate to %hz Hz || for %scope"
    //% expandableArgumentMode="enabled"
    //% hz.defl=11000
    export function setSampleRate( hz?: number, scope?: SampleRateScope ) : void {
        /* Dummy function */
    }

    /**
     * Play any recorded audio
     * 
     * @param sync If true, block until complete
     */
    //% block="​▶️ Start playback"
    export function play() : void {
        /* Dummy function */
    }

    /**
     * Play and recorded audio
     */
    //% block="⏹️ Stop"
    export function stop() : void {
        /* Dummy function */
    }

    /**
     * Play and recorded audio
     */
    //% block="🚮 Erase recording"
    export function erase() : void {
        /* Dummy function */
    }

    //% block
    export function audioIsPlaying() : boolean {
        return false;
    }

    //% block
    export function audioIsRecording() : boolean {
        return false;
    }

    //% block
    export function audioIsStopped() : boolean {
        return false;
    }

    //% block="When audio %eventType"
    export function audioEvent( eventType: AudioEvent, handler: () => void ) : void {
        /* Dummy function */
    }

    
}