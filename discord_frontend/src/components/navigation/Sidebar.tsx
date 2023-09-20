import { CSSProperties, useEffect, useState } from "react"
import {
  Navbar,
  Center,
  Tooltip,
  UnstyledButton,
  createStyles,
  Stack,
  rem,
  Button,
  Divider,
  useMantineTheme,
  Image,
  ScrollArea,
  Flex,
  Avatar,
  Box,
  MantineTheme,
  Sx,
} from "@mantine/core"
import {
  IconFingerprint,
  IconPlus,
  IconMoon,
  IconSun,
  IconMessage,
} from "@tabler/icons-react"
import { useGeneralStore } from "../../stores/generalStore"
import { UserButton, useSession } from "@clerk/clerk-react"
import { GET_SERVER_BY_PROFILE_ID_OF_MEMBER } from "../../graphql/queries/GetServerByProfileIdOfMember"

import { GET_PROFILE_BY_ID } from "../../graphql/queries/GetProfileById"

import {
  GetProfileByIdQuery,
  GetServerByProfileIdOfMemberQuery,
} from "../../gql/graphql"
import { Link } from "react-router-dom"

import { useQuery } from "@apollo/client"
import useModal from "../../hooks/useModal"
import { useMediaQuery } from "@mantine/hooks"
import { useProfileStore } from "../../stores/profileStore"

const useStyles = createStyles((theme) => ({
  link: {
    width: rem(50),
    height: rem(50),
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    opacity: 0.7,

    "&:hover": {
      opacity: 1,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[1],
    },
  },

  active: {
    opacity: 1,
    color: theme.white,
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.dark[3],
    },
  },
}))

interface NavbarLinkProps {
  icon: React.FC<any>
  label: string
  active?: boolean
  onClick?: () => void
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles()
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon size="1.8rem" stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  )
}
type LinkType = {
  icon: React.FC<any>
  label: string
  onClick?: () => void // This makes onClick optional
}

export function Sidebar() {
  console.log("SIDEBAR")
  const [active, setActive] = useState(2)
  const toggleDarkmode = useGeneralStore((state) => state.toggleDarkMode)
  const isDarkMode = useGeneralStore((state) => state.isDarkMode)
  const [profileId, setProfileId] = useState<number | null>(null)
  const { session } = useSession()

  const profile = useProfileStore((state) => state.user)

  const { data: dataServers, loading: loadingServers } =
    useQuery<GetServerByProfileIdOfMemberQuery>(
      GET_SERVER_BY_PROFILE_ID_OF_MEMBER,
      {
        variables: {
          profileId: profile?.id,
        },
        skip: !profile?.id,
      }
    )

  const serverModal = useModal("CreateServer")
  const joinServerModal = useModal("JoinServer")

  const darkModeToggleLink = {
    icon: isDarkMode ? IconSun : IconMoon,
    label: isDarkMode ? "Lightmode" : "Darkmode",
    onClick: toggleDarkmode,
  }
  const linksData: LinkType[] = [darkModeToggleLink]

  const links = linksData.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        if (link.onClick) link.onClick()
        setActive(index)
      }}
    />
  ))
  const sx: Sx = (theme) => ({
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[3],
    textAlign: "center",

    borderRadius: 100,

    cursor: "pointer",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    border: "none",
    padding: 0,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[4],
      transition: "all 0.2s ease-in-out",
    },
  })

  return (
    <Navbar
      pos={"fixed"}
      width={{ base: 80 }}
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[3],
      })}
    >
      <Stack justify="space-between" h={"100%"} my="md">
        <Navbar.Section>
          <Stack justify="center" align="center" spacing={"md"} mt="md">
            <Box onClick={() => serverModal.openModal()} sx={sx} p="md">
              <IconPlus color="green" size={rem(35)} />
            </Box>

            {/* // button for opening join chatroom modal */}
            <Box onClick={() => joinServerModal.openModal()} sx={sx} p="md">
              <IconMessage size={rem(35)} />
            </Box>

            <Divider orientation="horizontal" w={"100%"} size={"md"} />
            {/* loop over servers */}
            {loadingServers ? (
              <Center>
                <IconFingerprint size={rem(40)} />
              </Center>
            ) : (
              <ScrollArea h="50vh">
                {dataServers?.getServerByProfileIdOfMember?.map(
                  (server, index) => (
                    <Tooltip
                      w={rem(60)}
                      withArrow
                      key={`server-${index}`}
                      label={server.name}
                      transitionProps={{ duration: 0 }}
                    >
                      <Box
                        my="md"
                        w={rem(80)}
                        component="button"
                        sx={sx}
                        h={rem(80)}
                      >
                        <Link to={`/server/${server.id}`}>
                          <Avatar
                            src={server.imageUrl ? server.imageUrl : null}
                            radius={100}
                            size="md"
                          />
                        </Link>
                      </Box>
                    </Tooltip>
                  )
                )}{" "}
              </ScrollArea>
            )}
          </Stack>
        </Navbar.Section>

        <Navbar.Section>
          <Stack justify="center" align="center" spacing={"md"}>
            {links}
            <UserButton />
          </Stack>
        </Navbar.Section>
      </Stack>
    </Navbar>
  )
}
