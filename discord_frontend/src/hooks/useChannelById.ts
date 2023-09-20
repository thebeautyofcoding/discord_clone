import { useQuery } from "@apollo/client"
import { GetChannelByIdQuery } from "../gql/graphql"
import { GET_CHANNEL_BY_ID } from "../graphql/queries/GetChannelById"
import { useNavigate, useParams } from "react-router-dom"

export const useChannelById = (channelId: number) => {
  const navigate = useNavigate()
  const { serverId } = useParams<{ serverId: string }>()
  const { data } = useQuery<GetChannelByIdQuery>(GET_CHANNEL_BY_ID, {
    variables: {
      input: {
        channelId,
        serverId: Number(serverId),
      },
    },
    skip: !channelId,
    onError: (error) => {
      navigate("/")
    },
  })

  return data?.getChannelById
}
