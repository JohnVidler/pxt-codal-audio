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

    /**
     * Record an audio clip
     * 
     * @param sync If true, block until we run out of memory!
     */
    //% block="start recording"
    //% shim=codalAudio::record
    export function record() : void {
        /* Dummy function */
    }

    /**
     * Set the sample rate for recording, playback, or both
     * 
     * @param hz The sample rate, in Hz
     */
    //% block="set sample rate to %hz Hz || for %scope"
    //% expandableArgumentMode="enabled"
    //% hz.defl=11000
    export function setSampleRate( hz?: number, scope?: AudioSampleRateScope ) : void {
        /* Dummy function */
    }

    /**
     * Set the microphone gain. High values can cause distortion!
     * 
     * @param gain The gain to use.
     */
    //% block="set microphone gain to %gain"
    //% gain.defl=Medium
    export function setMicrophoneGain( gain?: AudioGainEnum ) : void {
        /* Dummy function */
    }

    /**
     * Play any recorded audio
     * 
     * @param sync If true, block until complete
     */
    //% block="​start playback"
    export function play() : void {
        /* Dummy function */
    }

    /**
     * Play and recorded audio
     */
    //% block="stop"
    //% shim=codalAudio::stop
    export function stop() : void {
        /* Dummy function */
    }

    /**
     * Play and recorded audio
     */
    //% block="erase recording"
    export function erase() : void {
        /* Dummy function */
    }

    //% block="audio is playing"
    export function audioIsPlaying() : boolean {
        return false;
    }

    //% block="audio is recording"
    export function audioIsRecording() : boolean {
        return false;
    }

    //% block="audio is stopped"
    export function audioIsStopped() : boolean {
        return false;
    }

    //% block="when audio %eventType"
    export function audioEvent( eventType: AudioEvent, handler: () => void ) : void {
        /* Dummy function */
    }

    
}

namespace pxsim {

    export class codalAudio {

        record() : void {
            console.log( "PXSIM -> codalAudio -> record()" );
        }

    /*    export function setSampleRate( hz?: number, scope?: AudioSampleRateScope ) : void {
            // Dummy function
        }

        export function setMicrophoneGain( gain?: AudioGainEnum ) : void {
            // Dummy function
        }

        export function play() : void {
            // Dummy function
        }*/

        stop() : void {
            console.log( "PXSIM -> codalAudio -> stop()" );
        }

        /*export function erase() : void {
            // Dummy function
        }

        export function audioIsPlaying() : boolean {
            return false;
        }

        export function audioIsRecording() : boolean {
            return false;
        }

        export function audioIsStopped() : boolean {
            return false;
        }

        export function audioEvent( eventType: AudioEvent, handler: () => void ) : void {
            // Dummy function
        }*/
    }
}