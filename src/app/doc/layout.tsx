import LiveBlocksProvider from "@/components/LiveBlocksProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
};
export default Layout;
