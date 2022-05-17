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
            recording = new StreamRecording( *uBit.audio.splitter );

            MixerChannel * channel = uBit.audio.mixer.addChannel( *recording, CHANNEL_FREQ );

            // By connecting to the mic channel, we activate it automatically, so shut it down again.
            

            channel->setVolume( 100.0 );
            uBit.audio.mixer.setVolume( 1000 );
            uBit.audio.setSpeakerEnabled( true );
        }
    }

    //%
    void record() {
        codalAudio::checkEnv();
        enableMic();
        recording->record();
    }

    //%
    void play() {
        codalAudio::checkEnv();
        enableMic();
        recording->play();
    }

    //%
    void stop() {
        codalAudio::checkEnv();
        recording->stop();
        disableMic();
    }

    //%
    void erase() {
        codalAudio::checkEnv();
        recording->erase();
    }

    //%
    int audioDuration( int sampleRate ) {
        return recording->duration( sampleRate )
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