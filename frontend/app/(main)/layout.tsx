import { NavigationSidebar } from "@/components/nav/NavigationSidebar"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ height: "100vh" }}>
      <div style={{ height: "100%" }}>
        <NavigationSidebar />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default MainLayout
