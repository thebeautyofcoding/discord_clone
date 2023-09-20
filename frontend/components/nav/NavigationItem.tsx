import React from "react"
import { Tooltip, Button, Image } from "@mantine/core"

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  id,
  imageUrl,
  name,
}) => {
  return (
    <Tooltip label={name} position="right">
      <Button variant="unstyled" fullWidth>
        <Image src={imageUrl} alt={name} width={48} height={48} />
        {name}
      </Button>
    </Tooltip>
  )
}
