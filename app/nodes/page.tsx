import { NodeGuidePage } from "../page";

export const metadata = {
  title: "机场指南",
  description: "核验机场官网、月付套餐、付款方式、客户端与入口状态。",
  openGraph: { images: [`${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/editorial/nodes.png`] },
};

export default function NodesPage() {
  return <NodeGuidePage />;
}
