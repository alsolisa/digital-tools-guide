"use client";

import { useState } from "react";

type DeviceKey = "windows-x64" | "windows-arm" | "mac-apple" | "mac-intel" | "android" | "ios";

const devices: Record<DeviceKey, { label: string; system: string; file: string; network: string; warning: string }> = {
  "windows-x64": { label: "Windows普通电脑", system: "Windows x64", file: "Clash Verge Rev 选择 x64-setup.exe；v2rayN 选择 windows-64-desktop.zip", network: "新手优先 Clash Verge Rev 的 x64-setup.exe；需要更多协议时再考虑 v2rayN", warning: "不要选择源码包、ARM版、fixed_webview2大文件或名称不明的压缩包。" },
  "windows-arm": { label: "Windows ARM电脑", system: "Windows ARM64", file: "选择名称含 arm64 或 aarch64 的正式版本", network: "先确认客户端发布页明确提供Windows ARM64；没有时不要强行安装x64版", warning: "常见于部分高通芯片电脑，与普通Intel/AMD电脑不同。" },
  "mac-apple": { label: "Mac苹果芯片", system: "macOS Apple Silicon", file: "选择 arm64、aarch64 或 Apple Silicon 版本", network: "Clash Verge Rev、Hiddify等需选择Apple芯片版本", warning: "在“关于本机”看到M1、M2、M3、M4等即属于苹果芯片。" },
  "mac-intel": { label: "Mac Intel芯片", system: "macOS Intel", file: "选择 x64 或 x86_64 版本", network: "可使用支持Intel Mac的正式客户端；购买前查看最低系统版本", warning: "较老Mac可能无法安装最新版，不能用来历不明的旧安装包替代。" },
  android: { label: "Android手机/平板", system: "Android", file: "多数近年设备选择 FlClash 的 android-arm64-v8a.apk；较老设备要先确认处理器", network: "FlClash优先选择 android-arm64-v8a.apk；只从项目发布页或本站已校验的备用文件下载", warning: "不要安装群文件、网盘APK或所谓去限制修改版；本站备用文件也要核对版本和SHA-256。" },
  ios: { label: "iPhone/iPad", system: "iOS / iPadOS", file: "只使用Apple App Store，不下载IPA或共享账号安装包", network: "按需求选择Shadowrocket、Quantumult X、Stash或Surge，并先确认订阅兼容", warning: "商店搜不到通常与Apple ID地区有关，不代表需要安装第三方版本。" },
};

export default function DeviceChooser({ context = "downloads" }: { context?: "downloads" | "network" }) {
  const [selected, setSelected] = useState<DeviceKey>("windows-x64");
  const device = devices[selected];
  return (
    <div className="device-chooser">
      <div className="device-chooser-copy"><span>设备助手</span><h2>先选你的设备，再看下载文件</h2><p>不知道芯片或安装包名称时不要猜。这里先给出安全的选择方向，最终仍以官方发布页为准。</p></div>
      <div className="device-options" aria-label="选择设备">
        {(Object.keys(devices) as DeviceKey[]).map((key) => <button type="button" aria-pressed={selected === key} key={key} onClick={() => setSelected(key)}>{devices[key].label}</button>)}
      </div>
      <div className="device-result" aria-live="polite">
        <div><small>识别结果</small><strong>{device.system}</strong></div>
        <div><small>{context === "network" ? "客户端建议" : "下载文件"}</small><p>{context === "network" ? device.network : device.file}</p></div>
        <div className="device-warning"><small>不要踩坑</small><p>{device.warning}</p></div>
      </div>
    </div>
  );
}
