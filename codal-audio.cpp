#include "pxt.h"
#include "MicroBit.h"
#include "StreamRecording.h"

using namespace pxt;

namespace codalAudio {

    static StreamRecording * recording = NULL;

    void checkEnv() {
        if( recording == NULL ) {
            recording = new StreamRecording( *uBit.audio.splitter );

            MixerChannel * channel = uBit.audio.mixer.addChannel( *recording, CHANNEL_FREQ );

            // By connecting to the mic channel, we activate it automatically, so shut it down again.
            uBit.audio.deactivateMic();
            uBit.audio.mic->disable();

            channel->setVolume( 100.0 );
            uBit.audio.mixer.setVolume( 1000 );
            uBit.audio.setSpeakerEnabled( true );
        }
    }

    //%
    void record() {
        codalAudio::checkEnv();
        recording->record();
    }

    //%
    void stop() {
        codalAudio::checkEnv();
        recording->stop();
    }
}