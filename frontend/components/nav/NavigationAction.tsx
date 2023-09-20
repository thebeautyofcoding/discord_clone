import React from "react"
import { Tooltip, Button } from "@mantine/core"
import { Plus } from "lucide-react"

export const NavigationAction: React.FC = () => {
  return (
    <Tooltip label="Add a server" position="right">
      <Button variant="outline" leftIcon={<Plus size={25} />} fullWidth>
        Add a server
      </Button>
    </Tooltip>
  )
}
