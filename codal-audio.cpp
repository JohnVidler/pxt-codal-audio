#include "pxt.h"
#include "MicroBit.h"
#include "StreamRecording.h"

using namespace pxt;

namespace codalAudio {

    static StreamRecording * recording = NULL;

    void enableMic() {
        uBit.audio.activateMic();
        uBit.audio.mic->enable();
    }

    void disableMic() {
        uBit.audio.mic->disable();
        uBit.audio.deactivateMic();
    }

    void checkEnv() {
        if( recording == NULL ) {
            MicroBitAudio::requestActivation();
            
            recording = new StreamRecording( *uBit.audio.splitter );

            MixerChannel * channel = uBit.audio.mixer.addChannel( *recording, 22000 );

            // By connecting to the mic channel, we activate it automatically, so shut it down again.
            disableMic();

            channel->setVolume( 100.0 );
            uBit.audio.mixer.setVolume( 1000 );
            uBit.audio.setSpeakerEnabled( true );
        }
    }

    //%
    void record() {
        checkEnv();
        enableMic();
        recording->record();
    }

    //%
    void play() {
        checkEnv();
        disableMic();
        recording->play();
    }

    //%
    void stop() {
        checkEnv();
        disableMic();
        recording->stop();
    }

    //%
    void erase() {
        checkEnv();
        disableMic();
        recording->erase();
    }

    //%
    void setMicrophoneGain(int gain) {
        switch( gain ) {
            case 1: uBit.audio.processor->setGain( 0.5 ); break;
            case 2: uBit.audio.processor->setGain( 0.8 ); break;
            case 3: uBit.audio.processor->setGain( 1.2 ); break;
        }
    }

    //%
    int audioDuration( int sampleRate ) {
        return recording->duration( sampleRate );
    }

    //%
    bool audioIsPlaying() {
        return recording->isPlaying();
    }

    //%
    bool audioIsRecording() {
        return recording->isRecording();
    }

    //%
    bool audioIsStopped() {
        return recording->isStopped();
    }
}