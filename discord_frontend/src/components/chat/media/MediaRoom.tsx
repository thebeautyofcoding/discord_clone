import "@livekit/components-styles"
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import { useLivekitAccessToken } from "../../../hooks/useLivekitAccessToken"

import { useNavigate, useParams } from "react-router-dom"

export default function MediaRoom({
  chatId,
  audio,
  video,
}: {
  chatId: string
  audio: boolean
  video: boolean
}) {
  const { token, loading } = useLivekitAccessToken(chatId)

  const { serverId } = useParams<{ serverId: string }>()
  const navigate = useNavigate()
  if (!token) return null

  return (
    <>
      <LiveKitRoom
        onDisconnected={() => {
          navigate("/server/" + serverId)
        }}
        video={video}
        audio={audio}
        token={token}
        connectOptions={{ autoSubscribe: false }}
        serverUrl={import.meta.env.VITE_LK_SERVER_URL}
        // Use the default LiveKit theme for nice styles.
        data-lk-theme="default"
        style={{ height: "calc(80vh - 60px)" }}
      >
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen 
      share tracks and to leave the room. */}
        <ControlBar />
      </LiveKitRoom>
    </>
  )
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  )
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  )
}
