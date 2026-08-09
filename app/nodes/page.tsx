import "../content-styles";
import { NodeGuidePage } from "../page";

export const metadata = {
  title: "VPN、机场与网络客户端新手指南",
  description: "从VPN、机场、节点、订阅链接和客户端的区别讲起，再比较月付套餐、付款方式和入口状态。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/nodes/` },
  openGraph: { images: [`${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/editorial/nodes.webp`] },
};

export default function NodesPage() {
  return <NodeGuidePage />;
}
