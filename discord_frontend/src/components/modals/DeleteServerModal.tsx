import { Button, Modal, Text } from "@mantine/core"
import { useMutation, useQuery } from "@apollo/client"
import { DELETE_SERVER } from "../../graphql/mutations/DeleteServer"
import { useNavigate, useParams } from "react-router-dom"
import { useProfileStore } from "../../stores/profileStore"
import { DeleteServerMutation, getProfileByIdQuery } from "../../gql/graphql"
import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"
import useModal from "../../hooks/useModal"

function DeleteServerModal() {
  const { isOpen, closeModal } = useModal("DeleteServer")
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
  const [deleteServer, { loading: loadingDeleteServerMt }] =
    useMutation<DeleteServerMutation>(DELETE_SERVER, {
      variables: {
        input: {
          serverId: Number(serverId),
        },
      },
      refetchQueries: ["GetServerByProfileIdOfMember"],
    })
  const navigate = useNavigate()
  const handleDeleteServer = () => {
    if (!dataProfileByUserId?.getProfileById?.id || !serverId) return
    deleteServer()
    navigate(`/server`)
    closeModal()
  }
  return (
    <Modal title="Delete Server" opened={isOpen} onClose={closeModal}>
      <Text fw={700}>Are you sure you want to delete this server?</Text>
      <Button onClick={handleDeleteServer} loading={loadingDeleteServerMt}>
        Delete Server
      </Button>
    </Modal>
  )
}

export default DeleteServerModal
