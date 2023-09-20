import { Button, Modal, Text } from "@mantine/core"
import { useMutation, useQuery } from "@apollo/client"
import { DELETE_SERVER } from "../../graphql/mutations/DeleteServer"
import { useNavigate, useParams } from "react-router-dom"
import { useProfileStore } from "../../stores/profileStore"
import { getProfileByIdQuery } from "../../gql/graphql"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"
import useModal from "../../hooks/useModal"
import { DELETE_CHANNEL_FROM_SERVER } from "../../graphql/mutations/DeleteChannelFromServer"
import { useGeneralStore } from "../../stores/generalStore"

function DeleteChannelModal() {
  const { isOpen, closeModal } = useModal("DeleteChannel")
  const { serverId } = useParams<{ serverId: string }>()
  const user = useProfileStore((state) => state.user)
  const { data: dataProfileByUserId } = useQuery<getProfileByIdQuery>(
    GET_PROFILE_BY_ID,
    {
      variables: {
        profileId: user?.id,
      },
      skip: !user?.id,
    }
  )
  const channelToBeDeletedOrUpdatedId = useGeneralStore(
    (state) => state.channelToBeDeletedOrUpdatedId
  )

  const [deleteChannel, { loading: loadingDeleteChannelMt }] = useMutation(
    DELETE_CHANNEL_FROM_SERVER,
    {
      variables: {
        input: {
          channelId: channelToBeDeletedOrUpdatedId,
        },
      },
      refetchQueries: ["GetServerById"],
    }
  )
  const navigate = useNavigate()
  const handleDeleteChannel = async () => {
    if (!dataProfileByUserId?.getProfileById?.id || !serverId) return
    await deleteChannel()
    closeModal()
    navigate(`/server/${serverId}`)
  }
  return (
    <Modal title="Delete Server" opened={isOpen} onClose={closeModal}>
      <Text fw={700}>Are you sure you want to delete this channel?</Text>
      <Button onClick={handleDeleteChannel} loading={loadingDeleteChannelMt}>
        Delete Channel
      </Button>
    </Modal>
  )
}

export default DeleteChannelModal
