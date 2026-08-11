import "../content-styles";
import {
  formatCnyPrice,
  formatPurchaseOptionNote,
  formatUsdPrice,
  getOfferPriceStatus,
  subscriptionOffers,
  USD_CNY_RATE,
  USD_CNY_RATE_UPDATED_AT,
} from "../../data/catalog";
import promotionManifest from "../../data/promotion-links.json";
import Image from "next/image";
import { CopyCodeButton } from "../components/CopyCodeButton";
import { BrandIcon, PageShell, SectionHeading, VerificationChip } from "../components/SiteChrome";

const promotionUrls = Object.fromEntries(promotionManifest.links.map((link) => [link.id, link.url])) as Record<string, string>;

const firstLoginSteps = [
  {
    number: "01",
    title: "在“我的订阅”找到订单",
    body: "登录 GamsGo，打开“我的订阅”，找到已经购买的 ChatGPT 会员。这里会显示平台交付的用户名、密码，以及后续获取登录验证码的入口。",
    image: { src: "/guides/subscriptions/gamsgo-get-code.png", width: 1380, height: 681, alt: "GamsGo我的订阅页面，账号信息已隐藏并标出获取链接或代码入口" },
  },
  {
    number: "02",
    title: "复制交付的用户名和密码",
    body: "先复制“用户名”，再复制“密码”。这是订单交付的订阅账号资料，不是你自己的邮箱密码；不要把它转发给陌生人。",
  },
  {
    number: "03",
    title: "在 ChatGPT 选择邮箱登录",
    body: "打开 ChatGPT 官方登录页，选择邮箱登录，把刚才复制的用户名粘贴到“Email address”输入框，再点击“继续”。",
    image: { src: "/guides/subscriptions/chatgpt-email-login.png", width: 1912, height: 882, alt: "ChatGPT登录窗口中的邮箱地址输入框" },
  },
  {
    number: "04",
    title: "输入订单里的密码",
    body: "粘贴 GamsGo“我的订阅”中显示的密码，确认用户名没有多余空格，然后点击“继续”。",
    image: { src: "/guides/subscriptions/chatgpt-password.png", width: 1920, height: 911, alt: "ChatGPT密码输入页面，账号和密码已隐藏" },
  },
  {
    number: "05",
    title: "遇到验证码页面，先不要关闭",
    body: "如果 ChatGPT 显示“验证你的身份”，先保留这个页面，再返回 GamsGo 的“我的订阅”获取一次性验证码。",
    image: { src: "/guides/subscriptions/chatgpt-verification.png", width: 1227, height: 625, alt: "ChatGPT身份验证页面，等待输入一次性验证码" },
  },
  {
    number: "06",
    title: "回到订单获取验证码",
    body: "点击“获取链接/代码”。如果出现确认提示，选择“是的，我有”；随后点击眼睛图标显示验证码并复制。验证码通常会过期，失效时回到这里重新获取。",
    image: { src: "/guides/subscriptions/gamsgo-hidden-code.png", width: 1184, height: 718, alt: "GamsGo订单页中的验证码区域，验证码已隐藏" },
  },
  {
    number: "07",
    title: "输入验证码，完成登录",
    body: "回到 ChatGPT，把验证码粘贴到输入框并点击“继续”。看到 ChatGPT 对话首页，就说明登录成功。以后仍从“我的订阅”查看账号状态和需要的登录信息。",
  },
];

export const metadata = {
  title: "GamsGo AI订阅",
  description: "介绍GamsGo平台、售后与付款方式，并比较ChatGPT、Claude、Gemini、Grok与Perplexity的官方价和购买方案。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/subscriptions/` },
  openGraph: { images: [`${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/editorial/subscriptions.webp`] },
};

export default function SubscriptionsPage() {
  const assetBase = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
  return (
    <PageShell>
      <section className="content-section gamsgo-hero" aria-labelledby="gamsgo-title">
        <div className="gamsgo-hero-copy">
          <span>AI订阅购买平台 · 第一次也能看懂</span>
          <h1 id="gamsgo-title">先认识 GamsGo，再选择 AI 订阅</h1>
          <p>GamsGo 提供 AI、流媒体和游戏等数字订阅服务。按照平台官方公开介绍，部分方案最高可节省 85%；本页把不同产品、价格和购买方式分开说明，让你可以直接比较。</p>
          <div className="gamsgo-hero-actions"><a className="primary-action" href={promotionUrls.gamsgo} target="_blank" rel="sponsored noopener">打开我的 GamsGo 推广页 ↗</a><a href="#offers">查看 AI 订阅方案 ↓</a></div>
        </div>
        <div className="gamsgo-hero-side">
          <figure className="gamsgo-hero-art"><Image src={`${assetBase}/illustrations/subscription-choice-v2.webp`} alt="一个购买者分流到共享使用、独享账号和本人账号充值三种方案的原创纸艺插画" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 44vw" priority unoptimized /><figcaption>原创插画 · 三种交付方式，对应不同账号归属</figcaption></figure>
          <div className="gamsgo-trust-panel" aria-label="GamsGo官方公开数据">
            <span>GamsGo 官方公开介绍</span>
            <dl><div><dt>7 年</dt><dd>数字订阅服务经验</dd></div><div><dt>150+</dt><dd>覆盖国家与地区</dd></div><div><dt>1000 万+</dt><dd>平台累计用户</dd></div><div><dt>最高 85%</dt><dd>部分订阅折扣</dd></div></dl>
          </div>
        </div>
      </section>

      <section className="content-section soft-section gamsgo-benefit-section">
        <SectionHeading index="01" title="为什么有人会考虑通过 GamsGo 订阅？" lead="对普通用户来说，主要考虑是付款方式、购买周期、账号交付和售后。价格是否更低必须以同一时间、同一商品和结算页最终金额比较。" />
        <div className="gamsgo-benefit-grid">
          <article><span>01 · 售后保障</span><h2>7×24 小时在线客服</h2><p>遇到账号、交付或订单问题，可以从订单页联系 GamsGo 客服处理，不需要自己寻找产品供应方。</p></article>
          <article><span>02 · 价格比较</span><h2>公开价格可读时再作参考</h2><p>共享、独享账号和本人账号充值不是同一种商品。本站只在公开页能够稳定读取时显示数字，最终仍以结算页为准。</p></article>
          <article><span>03 · 国内购买</span><h2>商品页可直接访问，付款更方便</h2><p>中国大陆用户可以直接打开购买页；结算时可选择支付宝等方式，实际可用选项以 GamsGo 结算页为准。</p></article>
          <article><span>04 · 信息透明</span><h2>先看清套餐，再决定购买</h2><p>商品页会展示价格、周期和交付方式。下单前可以先确认买到的是共享使用、独享账号还是本人账号充值。</p></article>
        </div>
        <aside className="email-preparation" aria-labelledby="email-preparation-title">
          <div><span>注册前准备</span><h2 id="email-preparation-title">准备一个能够正常接收验证码的邮箱</h2></div>
          <p>注册 GamsGo 或登录 AI 产品时，可以使用 Gmail（谷歌邮箱）、QQ邮箱或网易163邮箱。若几分钟后仍未收到验证码，先检查垃圾邮件，并避免连续多次点击发送；仍然收不到时，可以改用163邮箱重新注册。请使用自己能够长期访问的邮箱，今后登录验证或找回账号还会用到。</p>
        </aside>
      </section>

      <section className="content-section" id="offers">
        <SectionHeading index="02" title="AI订阅方案：先选产品，再选购买方式" lead="每张卡片先列官方参考价；GamsGo公开页能稳定读取时才显示起价，冲突、读取失败或人工套餐超过14天时会隐藏具体数字。" />
        <aside className="pricing-rate-note" aria-label="人民币价格换算说明">
          <div><span>统一换算</span><strong>1 USD = ¥{USD_CNY_RATE.toFixed(3)}</strong></div>
          <p>页面中的人民币参考值按同一汇率换算；下单时请以支付渠道的实时汇率、税费和结算页最终金额为准。汇率记录日期：{USD_CNY_RATE_UPDATED_AT}。</p>
        </aside>
        <div className="subscription-grid">
          {subscriptionOffers.filter((offer) => offer.productSlug !== "midjourney").map((offer) => {
            return (
              <article className={`subscription-card${offer.slug === "chatgpt-recharge" ? " subscription-card-featured" : ""}`} id={`offer-${offer.slug}`} key={offer.slug}>
                <div className="subscription-card-head">
                  <BrandIcon slug={offer.productSlug} name={offer.name} />
                  <div><h2>{offer.name}</h2><p>{offer.useCase}</p></div>
                </div>
                <div className="why-selected"><span>为什么收录</span><p>{offer.whySelected}</p><strong>付费前建议：{offer.freeAdvice}</strong></div>
                <div className={`price-comparison${offer.purchaseOptions ? " price-comparison-options" : ""}`}>
                  <div><a className="official-price-link" href={offer.officialUrl} target="_blank" rel="noopener noreferrer"><span>官方参考价</span><strong>{offer.officialPrice}</strong><small>{offer.officialCny}</small><em>打开官方价格页 ↗</em></a></div>
                  {offer.purchaseOptions ? <div className="price-option-summary"><span>GamsGo 当前方案</span>{offer.purchaseOptions.map((option) => <a className="price-option-link" href={option.url} key={option.label} target="_blank" rel="sponsored noopener"><span className="price-option-label"><b>{option.label}</b><small>{formatPurchaseOptionNote(option)}</small></span><span className="price-option-values"><strong>{formatUsdPrice(option.usd, option.suffix)}</strong><small>{formatCnyPrice(option.usd, option.suffix)}</small></span></a>)}<a className="promotion-price-action" href={offer.affiliateUrl} target="_blank" rel="sponsored noopener">打开购买页面</a></div> : <div><span>GamsGo公开价</span><strong>{offer.gamsgoPrice}</strong><small>{offer.gamsgoCny}</small><VerificationChip status={getOfferPriceStatus(offer.slug)} /><a className="promotion-price-action" href={offer.affiliateUrl} target="_blank" rel="sponsored noopener">打开购买页面</a></div>}
                </div>
                <p className="price-note">{offer.priceNote}</p>
                {offer.marketplaceSummary && <aside className="marketplace-summary"><span>市场中心是什么？</span><p>{offer.marketplaceSummary}</p></aside>}
                <dl className="fact-list">
                  <div><dt>交付方式</dt><dd>{offer.deliveryType}</dd></div>
                  <div><dt>账号归属</dt><dd>{offer.ownership}</dd></div>
                  <div><dt>隐私</dt><dd>{offer.privacy}</dd></div>
                  <div><dt>续费</dt><dd>{offer.renewal}</dd></div>
                  <div><dt>付款</dt><dd>{offer.payment}{offer.paymentNote && <strong className="payment-alert">{offer.paymentNote}</strong>}</dd></div>
                  <div><dt>售后</dt><dd>{offer.support}</dd></div>
                </dl>
                <div className="card-source-row"><span>价格核验：{offer.priceVerifiedAt || offer.verifiedAt}</span><a href={offer.affiliateUrl} target="_blank" rel="sponsored noopener">打开推广商品页 ↗</a></div>
                <div className="subscription-actions">
                  <a className="official-action" href={offer.officialUrl} target="_blank" rel="noopener noreferrer">查看官方方案 ↗</a>
                </div>
                <div className={`purchase-option-grid${(offer.purchaseChannels?.length || offer.purchaseOptions?.length || 0) > 1 ? " purchase-option-grid-multiple" : ""}`}>
                  {offer.purchaseChannels ? offer.purchaseChannels.map((channel) => <a href={channel.url} key={channel.label} target="_blank" rel="sponsored noopener"><span>{channel.label}</span><strong>{channel.title}</strong><small>{channel.note}</small><b>打开购买页 ↗</b></a>) : offer.purchaseOptions ? offer.purchaseOptions.map((option) => <a href={option.url} key={option.label} target="_blank" rel="sponsored noopener"><span>{option.label}</span><strong><span>{formatUsdPrice(option.usd, option.suffix)}</span><em>{formatCnyPrice(option.usd, option.suffix)}</em></strong><small>{formatPurchaseOptionNote(option)}</small><b>前往购买 ↗</b></a>) : <a className="purchase-option-single" href={offer.affiliateUrl} target="_blank" rel="sponsored noopener"><span>GamsGo 购买入口</span><strong>查看当前方案</strong><small>价格、周期和交付方式以购买页为准</small><b>前往购买 ↗</b></a>}
                </div>
                {offer.purchaseQrCodes && <div className="purchase-qr-grid" aria-label="ChatGPT购买二维码">{offer.purchaseQrCodes.map((qr) => <a href={qr.url} key={qr.label} target="_blank" rel="sponsored noopener"><Image src={`${assetBase}${qr.image}`} width={100} height={100} unoptimized alt={`${qr.label}购买二维码`} /><span>扫码打开<br /><strong>{qr.label}</strong></span></a>)}</div>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section soft-section subscription-howto" id="subscription-howto">
        <SectionHeading index="03" title="先领优惠，再完成首次登录" lead="优惠券、下单和登录分成两段操作。先在 GamsGo 结算页确认优惠，再从“我的订阅”取得账号与验证码；跟着下面的顺序做即可。" />

        <div className="coupon-guide" aria-labelledby="coupon-guide-title">
          <div className="coupon-guide-copy">
            <span>下单前 · 先看优惠</span>
            <h2 id="coupon-guide-title">领取优惠券，或使用优惠码</h2>
            <ol>
              <li>在 GamsGo 首页右下角点击优惠券图标，先领取当前账号可用的优惠券。</li>
              <li>进入结算页，展开“有促销码或券吗？”，选择已领取的优惠券，或填写下面的优惠码。</li>
              <li>点击“使用”后再确认合计金额；能否使用、是否可以叠加及最终优惠金额，以结算页实际显示为准。</li>
            </ol>
            <CopyCodeButton code="RWSY8" />
          </div>
          <div className="coupon-proof-grid">
            <figure>
              <a href={`${assetBase}/guides/subscriptions/gamsgo-coupon-entry.png`} target="_blank" rel="noopener noreferrer" aria-label="打开优惠券入口大图"><Image src={`${assetBase}/guides/subscriptions/gamsgo-coupon-entry.png`} width={1711} height={947} unoptimized alt="GamsGo首页右下角的优惠券入口" /></a>
              <figcaption><span><b>第1步</b> 点击首页右下角的优惠券图标</span><a className="figure-zoom-link" href={`${assetBase}/guides/subscriptions/gamsgo-coupon-entry.png`} target="_blank" rel="noopener noreferrer">点击查看大图 ↗</a></figcaption>
            </figure>
            <figure>
              <a href={`${assetBase}/guides/subscriptions/gamsgo-coupon-checkout.png`} target="_blank" rel="noopener noreferrer" aria-label="打开结算页优惠码大图"><Image src={`${assetBase}/guides/subscriptions/gamsgo-coupon-checkout.png`} width={1356} height={570} unoptimized alt="GamsGo结算页中的促销码和优惠券输入区域" /></a>
              <figcaption><span><b>第2步</b> 在结算页选择优惠券或填写优惠码</span><a className="figure-zoom-link" href={`${assetBase}/guides/subscriptions/gamsgo-coupon-checkout.png`} target="_blank" rel="noopener noreferrer">点击查看大图 ↗</a></figcaption>
            </figure>
          </div>
        </div>

        <div className="first-login-guide" aria-labelledby="first-login-title">
          <div className="first-login-intro">
            <span>购买后 · 第一次登录</span>
            <h2 id="first-login-title">从“我的订阅”取得账号和验证码</h2>
            <p>下面以 GamsGo 交付的 ChatGPT 账号为例。页面名称可能随平台更新略有变化，但顺序不变：复制账号 → 登录 ChatGPT → 返回订单获取验证码 → 完成验证。</p>
          </div>
          <ol className="first-login-steps">
            {firstLoginSteps.map((step) => (
              <li key={step.number}>
                <div className="login-step-copy"><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></div>
                {step.image && <figure>
                  <a href={`${assetBase}${step.image.src}`} target="_blank" rel="noopener noreferrer" aria-label={`打开${step.title}大图`}><Image src={`${assetBase}${step.image.src}`} width={step.image.width} height={step.image.height} unoptimized alt={step.image.alt} /></a>
                  <figcaption><span>示例截图中的账号、密码和验证码均已隐藏</span><a className="figure-zoom-link" href={`${assetBase}${step.image.src}`} target="_blank" rel="noopener noreferrer">点击查看大图 ↗</a></figcaption>
                </figure>}
              </li>
            ))}
          </ol>
          <aside className="login-safety-note"><strong>保护账号信息</strong><p>只在 GamsGo 订单页查看交付信息，只在 <b>chatgpt.com</b> 输入账号、密码和验证码。不要把这些内容发送给陌生人，也不要使用自己其他网站的常用密码。</p></aside>
        </div>
      </section>

    </PageShell>
  );
}
