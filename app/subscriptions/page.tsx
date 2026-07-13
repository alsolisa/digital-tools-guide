import { aiProducts, getOfferPriceStatus, subscriptionOffers } from "../../data/catalog";
import autoSync from "../../data/auto-sync.json";
import Link from "next/link";
import { BrandIcon, BrandNotice, Disclosure, EditorialCoverFeature, FeedbackLink, PageIntro, PageShell, RiskBadge, SectionHeading, VerificationChip } from "../components/SiteChrome";

export const metadata = {
  title: "GamsGo AI订阅",
  description: "比较ChatGPT、Claude、Gemini、Grok、Perplexity与Midjourney的官方价、GamsGo公开价、交付方式和账号风险。",
  openGraph: { images: [`${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/editorial/subscriptions.png`] },
};

export default function SubscriptionsPage() {
  const exchangeDate = autoSync.exchange.date;
  const usdToCny = autoSync.exchange.rates.CNY.toFixed(4);
  return (
    <PageShell>
      <PageIntro
        eyebrow="AI订阅 · 官方事实与商家宣传分开"
        title="先看账号归谁，再比较价格"
        lead="第三方订阅最容易被忽略的不是价格，而是账号所有权、恢复权限和聊天隐私。每项产品都把官方价、商家公开价与交付风险分开标注。"
        aside={<><strong>价格口径</strong><p>原币价格 + 人民币参考价</p><small>汇率参考：{exchangeDate}，1 USD≈{usdToCny} CNY；每日自动更新，不含税费和支付手续费。</small></>}
      />

      <EditorialCoverFeature slug="subscriptions" title="AI订阅：购买前先看账号归属" lead="视觉版先讲清官方价、本人账号充值、交付账号和共享网页的差别，再进入具体产品对比。" />

      <section className="content-section">
        <Disclosure />
        <SectionHeading index="01" title="六项AI订阅对比" lead="公开页没有稳定显示精确价格时，直接写“购买页实时显示”。" />
        <BrandNotice />
        <div className="subscription-grid">
          {subscriptionOffers.map((offer) => {
            const product = aiProducts.find((item) => item.slug === offer.productSlug);
            return (
              <article className="subscription-card" key={offer.slug}>
                <div className="subscription-card-head">
                  <BrandIcon slug={offer.productSlug} name={offer.name} />
                  <div><h2>{offer.name}</h2><p>{offer.useCase}</p></div>
                  <RiskBadge level={offer.risk}>{offer.riskLabel}</RiskBadge>
                </div>
                <div className="price-comparison">
                  <div><span>官方参考价</span><strong>{offer.officialPrice}</strong><small>{offer.officialCny}</small></div>
                  <div><span>GamsGo公开价</span><strong>{offer.gamsgoPrice}</strong><small>{offer.gamsgoCny}</small><VerificationChip status={getOfferPriceStatus(offer.slug)} /></div>
                </div>
                <p className="price-note">{offer.priceNote}</p>
                <div className="purchase-proof"><span>下单前必须确认</span><p>{offer.deliveryType} · {offer.ownership}</p></div>
                <dl className="fact-list">
                  <div><dt>交付方式</dt><dd>{offer.deliveryType}</dd></div>
                  <div><dt>账号归属</dt><dd>{offer.ownership}</dd></div>
                  <div><dt>隐私</dt><dd>{offer.privacy}</dd></div>
                  <div><dt>续费</dt><dd>{offer.renewal}</dd></div>
                  <div><dt>付款</dt><dd>{offer.payment}</dd></div>
                  <div><dt>地区</dt><dd>{offer.region}</dd></div>
                  <div><dt>售后</dt><dd>{offer.support}</dd></div>
                </dl>
                <div className="card-source-row"><span>核验：{offer.verifiedAt}</span><a href={offer.sourceUrl} target="_blank" rel="noopener noreferrer">打开对应商品资料页 ↗</a></div>
                <div className="subscription-actions">
                  {product && <Link className="text-action" href={`/ai/${product.slug}`}>先看产品教程</Link>}
                  <a className="primary-action" href={offer.affiliateUrl} target="_blank" rel="sponsored noopener">打开推广购买入口 ↗</a>
                </div>
                <small className="inline-disclosure">推广链接 · 下单前请再次核对产品名称、周期与交付方式</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="02" title="三种交付方式，风险完全不同" />
        <div className="delivery-grid">
          <article><span>01</span><h3>本人账号充值</h3><p>会员开通在你原来的账号上，历史记录与设置通常可以保留。仍要警惕访问密钥、授权范围和自动续费。</p><RiskBadge level="medium">优先选择，但仍需核对</RiskBadge></article>
          <article><span>02</span><h3>独立账号交付</h3><p>平台提供一个新账号。必须确认恢复邮箱、二次验证、修改密码和订阅到期后的控制权。</p><RiskBadge level="high">不存放敏感资料</RiskBadge></article>
          <article><span>03</span><h3>共享网页使用</h3><p>多人或平台中转使用同一环境，价格低但隐私、稳定性和功能完整性最弱。</p><RiskBadge level="high">只用于低敏感试用</RiskBadge></article>
        </div>
      </section>

      <section className="content-section purchase-checklist">
        <SectionHeading index="03" title="付款前一分钟检查" />
        <ol><li>产品是在本人账号充值，还是交付一个新账号？</li><li>能否修改密码、恢复邮箱和二次验证？</li><li>页面显示的是月付、年付折算，还是限时公开起价？</li><li>订阅结束后，聊天记录、云盘或生成内容能否导出？</li><li>售后由GamsGo处理，还是AI官方处理？</li></ol>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="04" title="安全购买流程" lead="不要从价格最低的一步直接跳到付款。" />
        <ol className="purchase-flow"><li><span>01</span><div><strong>先打开商品资料页</strong><p>确认产品名称、交付方式、周期、地区与当前公开价格。</p></div></li><li><span>02</span><div><strong>确认账号归属</strong><p>本人账号充值优先；账号交付必须检查恢复邮箱、密码和二次验证。</p></div></li><li><span>03</span><div><strong>进入结算页核对</strong><p>核对币种、税费、支付手续费、自动续费和退款条款。</p></div></li><li><span>04</span><div><strong>交付后立即检查</strong><p>确认会员状态和到期时间；交付账号应修改可修改的安全设置。</p></div></li></ol>
        <FeedbackLink label="价格、付款或交付信息与页面不一致？反馈更新" />
      </section>
    </PageShell>
  );
}
