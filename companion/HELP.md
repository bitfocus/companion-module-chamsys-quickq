## Chamsys QuickQ

Control Chamsys [QuickQ lighting consoles](https://chamsyslighting.com/collections/quickq-consoles).

**Requirements**

- Requires QuickQ Software Version 6.0 or later
- On your Companion computer, port `9000` must be available to receive feedback from the console

**Basic Configuration**

- Enable Open Sound Control in the `Network Settings Window` on the QuickQ console
- In the configuration page for the QuickQ module in Companion, enter the IP address of the console

**Playback numbers on a QuickQ 10**

Playback 1 is the cue stack. The two chase playbacks, from left to right, are playbacks 3 and 2.

**Available Actions**

- Set playback fader level
- Go on playback
- Flash playback (100% to flash, 0% to release)
- Pause playback
- Release playback
- Control 10Scene button (Activate/Deactivate). With a zone, the address is `/10scene/<zone>/<item>`
- Start feedback (`/feedback/pb`, `/feedback/exec`, or `/feedback/pb+exec`)
- Stop feedback (`/feedback/off`)

**Available Feedback**

- Playback level
- Execute state, from `/exec/<row>/<execute>` (execute 5 on the first row is `/exec/1/5`)

**Available Variables**

- playback\_#_level
- execute\_row\_execute\_state (0 is off, 1 is on)
