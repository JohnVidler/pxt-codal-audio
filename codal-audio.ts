/*
    The MIT License (MIT)

    Copyright (c) 2022 Lancaster University

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
*/

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

enum AudioRecordingMode {
    Stopped,
    Recording,
    Playing
}

/**
 * Functions to operate the v2 on-board microphone and speaker.
 */
//% weight=5 color=#e26fb4 icon="\uf130" block="V2 Audio" advanced=false
namespace codalAudio {

    // Expressed in samples, as we can have varying recording and playback rates!
    const MAX_SAMPLES: number = 55000
    const INTERVAL_STEP: number = 100

    // Shim state
    let _moduleMode: AudioRecordingMode = AudioRecordingMode.Stopped;
    let _recordingFreqHz: number = 22000
    let _playbackFreqHz: number = 22000
    let _micGain: AudioGainEnum = AudioGainEnum.Medium

    // Track if we have a simulator tick timer to use...
    let _internalTimer: number = 0
    let _memoryFill:    number = 0
    let _handlers: (() => void)[] = []

    function __init__(): void {
        if( _internalTimer !== 0 )
            return
        _internalTimer = 1

        control.runInParallel( () => {
            while (true) {

                switch (_moduleMode) {
                    case AudioRecordingMode.Playing:
                        if (_memoryFill <= 0) {
                            _memoryFill = 0;
                            return __setMode__(AudioRecordingMode.Stopped)
                        }
                        _memoryFill -= _playbackFreqHz / (1000 / INTERVAL_STEP)
                        console.log(`PLAY --> Memory fill: ${_memoryFill}/${MAX_SAMPLES}, mode = ${_moduleMode}`)
                        break
                    
                    case AudioRecordingMode.Recording:
                        if (_memoryFill >= MAX_SAMPLES) {
                            _memoryFill = MAX_SAMPLES;
                            return __setMode__(AudioRecordingMode.Stopped)
                        }
                        _memoryFill += _recordingFreqHz / (1000 / INTERVAL_STEP)
                        console.log(`RECD --> Memory fill: ${_memoryFill}/${MAX_SAMPLES}, mode = ${_moduleMode}`)
                        break
                }

                basic.pause( INTERVAL_STEP )
            }
            console.log( "Impossible code state! Emergency reset!" )
            _internalTimer = 0
        })
    }

    function __emitEvent__( type: AudioEvent ): void {
        if( _handlers[type] !== undefined )
            return _handlers[type]();
    }

    function __setMode__( mode: AudioRecordingMode ): void {
        switch( mode ) {
            case AudioRecordingMode.Stopped:
                if( _moduleMode == AudioRecordingMode.Recording ) {
                    console.log( "Recording --> Stopped" )
                    _moduleMode = AudioRecordingMode.Stopped
                    return __emitEvent__( AudioEvent.StoppedRecording )
                }
                
                if( _moduleMode == AudioRecordingMode.Playing ) {
                    console.log("Playing --> Stopped")
                    _moduleMode = AudioRecordingMode.Stopped
                    return __emitEvent__( AudioEvent.StoppedPlaying )
                }

                console.log("Stopped --> Stopped")
                _moduleMode = AudioRecordingMode.Stopped;
                return
            
            case AudioRecordingMode.Playing:
                if( _moduleMode !== AudioRecordingMode.Stopped ) {
                    console.log("??? --> Stopped")
                    __setMode__( AudioRecordingMode.Stopped )
                }
                
                console.log("Stopped --> Playing")
                _moduleMode = AudioRecordingMode.Playing;
                return __emitEvent__( AudioEvent.StartedPlaying )
            
            case AudioRecordingMode.Recording:
                if (_moduleMode !== AudioRecordingMode.Stopped) {
                    console.log("??? --> Stopped")
                    __setMode__(AudioRecordingMode.Stopped)
                }

                console.log("Stopped --> Recording")
                _moduleMode = AudioRecordingMode.Recording;
                return __emitEvent__( AudioEvent.StartedRecording )
        }
    }

    /**
     * Record an audio clip
     * 
     * @param sync If true, block until we run out of memory!
     */
    //% block="start recording"
    //% shim=codalAudio::record
    export function record(): void {
        __init__()
        if( !isFull() )
            __setMode__( AudioRecordingMode.Recording );
    }

    /**
     * Set the sample rate for recording, playback, or both
     * 
     * @param hz The sample rate, in Hz
     */
    //% block="set sample rate to %hz Hz || for %scope"
    //% expandableArgumentMode="enabled"
    //% hz.defl=22000
    export function setSampleRate(hz: number, scope?: AudioSampleRateScope): void {
        __init__()
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
        __init__()
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
        __init__()
        if( !isEmpty() )
            __setMode__(AudioRecordingMode.Playing)
        return
    }

    /**
     * Play and recorded audio
     */
    //% block="stop"
    //% shim=codalAudio::stop
    export function stop(): void {
        __init__()
        __setMode__(AudioRecordingMode.Stopped)
        return
    }

    /**
     * Play and recorded audio
     */
    //% block="erase recording"
    //% shim=codalAudio::erase
    export function erase(): void {
        __init__()
        __setMode__(AudioRecordingMode.Stopped)
        _memoryFill = 0
        return
    }

    //% block="microphone gain"
    export function micGain(): AudioGainEnum {
        return _micGain
    }

    //% block="recording frequency"
    export function recordingHz(): number {
        __init__()
        return _recordingFreqHz
    }

    //% block="playback frequency"
    export function playbackHz(): number {
        __init__()
        return _playbackFreqHz
    }

    //% block="audio duration at %hz hz"
    //% shim=codalAudio::audioDiration
    export function audioDuration(hz?: number): number {
        __init__()
        return _memoryFill / hz
    }

    //% block="audio is playing"
    //% shim=codalAudio::audioIsPlaying
    export function audioIsPlaying(): boolean {
        __init__()
        return _moduleMode === AudioRecordingMode.Playing
    }

    //% block="audio is recording"
    //% shim=codalAudio::audioIsRecording
    export function audioIsRecording(): boolean {
        __init__()
        return _moduleMode === AudioRecordingMode.Recording
    }

    //% block="audio is stopped"
    //% shim=codalAudio::audioIsStopped
    export function audioIsStopped(): boolean {
        __init__()
        return _moduleMode === AudioRecordingMode.Stopped
    }

    //% block="audio buffer is full"
    export function isFull(): boolean {
        __init__()
        return _memoryFill >= MAX_SAMPLES
    }

    //% block="audio buffer is empty"
    export function isEmpty(): boolean {
        __init__()
        return _memoryFill <= 0
    }

    //% block="when audio %eventType"
    export function audioEvent(eventType: AudioEvent, handler: () => void): void {
        __init__()
        if( _handlers[eventType] !== undefined )
            console.warn( "Just about to overwrite an existing event handler. This should never happen!" )
        _handlers[eventType] = handler
    }


}