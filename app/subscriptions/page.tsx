import { aiProducts, getOfferPriceStatus, subscriptionOffers } from "../../data/catalog";
import autoSync from "../../data/auto-sync.json";
import Link from "next/link";
import { BrandIcon, BrandNotice, Disclosure, EditorialCoverFeature, FeedbackLink, PageIntro, PageShell, QuickSummary, RiskBadge, SectionHeading, VerificationChip } from "../components/SiteChrome";
import SubscriptionValueCalculator from "../components/SubscriptionValueCalculator";

export const metadata = {
  title: "GamsGo AI订阅",
  description: "比较ChatGPT、Claude、Gemini、Grok、Perplexity与Midjourney的官方价、GamsGo公开价、交付方式和账号风险。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/subscriptions/` },
  openGraph: { images: [`${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/editorial/subscriptions.png`] },
};

export default function SubscriptionsPage() {
  const exchangeDate = autoSync.exchange.date;
  const usdToCny = autoSync.exchange.rates.CNY.toFixed(4);
  return (
    <PageShell>
      <PageIntro
        eyebrow="AI会员购买 · 第一次也能看懂"
        title="先判断要不要买，再决定去哪里买"
        lead="免费版、官方订阅和第三方购买不是一回事。先看你需要什么、账号归谁和会失去哪些保障，最后才比较价格。"
        aside={<><strong>价格口径</strong><p>原币价格 + 人民币参考价</p><small>汇率参考：{exchangeDate}，1 USD≈{usdToCny} CNY；每日自动更新，不含税费和支付手续费。</small></>}
      />
      <QuickSummary title="大多数新手不应该先买最便宜的" points={["先用免费版完成真实任务3—7天", "能官方购买时，优先本人账号与官方订阅", "第三方低价必须先确认账号归属和交付方式", "价格冲突或无法读取时，本站会隐藏数字"]} action={{ label: "直接看六项风险分级", href: "#offers" }} />

      <EditorialCoverFeature slug="subscriptions" title="AI订阅：购买前先看账号归属" lead="视觉版先讲清官方价、本人账号充值、交付账号和共享网页的差别，再进入具体产品对比。" />

      <section className="content-section subscription-value-section">
        <SubscriptionValueCalculator />
      </section>

      <section className="content-section subscription-basics" id="before-buy">
        <SectionHeading index="01" title="GamsGo是什么？为什么有人会选择它？" lead="先说明关系：GamsGo是第三方购买渠道，不是ChatGPT、Claude、Gemini等AI产品的官方公司。" />
        <div className="platform-explainer-grid">
          <article><span>它可能解决的问题</span><h2>支付、地区或购买流程不方便</h2><p>第三方平台可能提供不同支付方式、本人账号充值、交付账号或共享网页，让部分用户更容易购买或以更低价格试用。</p></article>
          <article><span>你付出的代价</span><h2>官方保障可能变少</h2><p>售后通常由第三方处理；账号归属、找回权限、聊天隐私、功能完整性和续费方式也可能与官方购买不同。</p></article>
          <article className="recommended"><span>本站默认建议</span><h2>能官方购买时，优先官方</h2><p>如果要保存私人聊天、公司文件或长期资料，优先使用本人账号和官方订阅。第三方更适合明确理解风险后的替代选择。</p></article>
        </div>
        <div className="official-third-party-flow"><article><strong>官方购买</strong><p>你 → AI官方</p><small>账号、付款、续费和售后关系最直接</small></article><i>或</i><article><strong>第三方购买</strong><p>你 → GamsGo → AI产品或交付账号</p><small>购买可能更方便，但中间多了一层账号与售后风险</small></article></div>
      </section>

      <section className="content-section soft-section subscription-chooser">
        <SectionHeading index="02" title="为什么首批选择这六项？" lead="它们覆盖六种最常见的普通用户需求，并且在GamsGo有对应商品资料。收录不等于每个人都应该购买。" />
        <div className="subscription-choice-grid">{subscriptionOffers.map((offer) => <a href={`#offer-${offer.slug}`} key={offer.slug}><BrandIcon slug={offer.productSlug} name={offer.name} /><div><h3>{offer.name}</h3><p>{offer.whySelected}</p><strong>{offer.freeAdvice}</strong></div><span>查看 →</span></a>)}</div>
      </section>

      <section className="content-section" id="offers">
        <Disclosure />
        <SectionHeading index="03" title="六项AI订阅资料" lead="官方订阅、本人账号充值、交付账号和共享网页不是同一种商品。只有权益与交付方式相同时，价格才具有直接可比性。" />
        <div className="non-comparable-note"><strong>不要只算“便宜多少”</strong><p>价格特别低时，先确认是不是年付折算、交付账号、共享网页、限时价或功能受限版本。</p></div>
        <BrandNotice />
        <div className="subscription-grid">
          {subscriptionOffers.map((offer) => {
            const product = aiProducts.find((item) => item.slug === offer.productSlug);
            return (
              <article className="subscription-card" id={`offer-${offer.slug}`} key={offer.slug}>
                <div className="subscription-card-head">
                  <BrandIcon slug={offer.productSlug} name={offer.name} />
                  <div><h2>{offer.name}</h2><p>{offer.useCase}</p></div>
                  <RiskBadge level={offer.risk}>{offer.riskLabel}</RiskBadge>
                </div>
                <div className="why-selected"><span>为什么收录</span><p>{offer.whySelected}</p><strong>付费前建议：{offer.freeAdvice}</strong></div>
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
                  <a className="official-action" href={offer.officialUrl} target="_blank" rel="noopener noreferrer">查看官方方案 ↗</a>
                  <a className="primary-action" href={offer.affiliateUrl} target="_blank" rel="sponsored noopener">第三方推广入口 ↗</a>
                </div>
                <small className="inline-disclosure">推广链接 · 下单前请再次核对产品名称、周期与交付方式</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="04" title="三种交付方式，风险完全不同" />
        <div className="delivery-grid">
          <article><span>01</span><h3>本人账号充值</h3><p>会员开通在你原来的账号上，历史记录与设置通常可以保留。仍要警惕访问密钥、授权范围和自动续费。</p><RiskBadge level="medium">优先选择，但仍需核对</RiskBadge></article>
          <article><span>02</span><h3>独立账号交付</h3><p>平台提供一个新账号。必须确认恢复邮箱、二次验证、修改密码和订阅到期后的控制权。</p><RiskBadge level="high">不存放敏感资料</RiskBadge></article>
          <article><span>03</span><h3>共享网页使用</h3><p>多人或平台中转使用同一环境，价格低但隐私、稳定性和功能完整性最弱。</p><RiskBadge level="high">只用于低敏感试用</RiskBadge></article>
        </div>
      </section>

      <section className="content-section purchase-checklist">
        <SectionHeading index="05" title="付款前一分钟检查" />
        <ol><li>产品是在本人账号充值，还是交付一个新账号？</li><li>能否修改密码、恢复邮箱和二次验证？</li><li>页面显示的是月付、年付折算，还是限时公开起价？</li><li>订阅结束后，聊天记录、云盘或生成内容能否导出？</li><li>售后由GamsGo处理，还是AI官方处理？</li></ol>
      </section>

      <section className="content-section soft-section">
        <SectionHeading index="06" title="安全购买流程" lead="不要从价格最低的一步直接跳到付款。" />
        <ol className="purchase-flow"><li><span>01</span><div><strong>先打开商品资料页</strong><p>确认产品名称、交付方式、周期、地区与当前公开价格。</p></div></li><li><span>02</span><div><strong>确认账号归属</strong><p>本人账号充值优先；账号交付必须检查恢复邮箱、密码和二次验证。</p></div></li><li><span>03</span><div><strong>进入结算页核对</strong><p>核对币种、税费、支付手续费、自动续费和退款条款。</p></div></li><li><span>04</span><div><strong>交付后立即检查</strong><p>确认会员状态和到期时间；交付账号应修改可修改的安全设置。</p></div></li></ol>
        <FeedbackLink label="价格、付款或交付信息与页面不一致？反馈更新" />
      </section>
    </PageShell>
  );
}
