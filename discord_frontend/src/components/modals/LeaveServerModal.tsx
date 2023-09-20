import { Button, Modal, Text } from "@mantine/core"
import { LEAVE_SERVER } from "../../graphql/mutations/LeaveServer"
import { useMutation } from "@apollo/client"
import { useNavigate, useParams } from "react-router-dom"
import useModal from "../../hooks/useModal"

function LeaveServerModal() {
  const { isOpen, closeModal } = useModal("LeaveServer")
  const navigate = useNavigate()

  const { serverId } = useParams<{ serverId: string }>()
  const [leaveServer, { loading }] = useMutation(LEAVE_SERVER, {
    onCompleted: (data) => {
      console.log(data)
      navigate(`/`)
    },
    variables: {
      input: {
        serverId: Number(serverId),
      },
    },
    refetchQueries: ["GetServerByProfileIdOfMember"],
  })
  const handleLeaveServer = () => {
    leaveServer()
    closeModal()
  }
  return (
    <Modal title="Leave Server" opened={isOpen} onClose={closeModal}>
      <Text fw={700}> Do you want to leave this server?</Text>
      <Button color="red" disabled={loading} onClick={handleLeaveServer}>
        Leave Server
      </Button>
    </Modal>
  )
}

export default LeaveServerModal
