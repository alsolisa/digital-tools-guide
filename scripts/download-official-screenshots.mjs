import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkedAt = "2026-07-13";

const appleApps = [
  { slug: "claude", id: "6473753684" },
  { slug: "perplexity", id: "1668000334" },
  { slug: "youtube", id: "544007664", extension: "jpg" },
  { slug: "tiktok", id: "835599320" },
];

const googleApps = [
  {
    slug: "chatgpt",
    urls: [
      "https://play-lh.googleusercontent.com/dPc3vh4x7L3gJ3_vFLT_dw9BY9ZNXEjcu3eBlXOkkn3klpNfUo3perqmeFqrmFUNB11IcU94wmbgkL9uQ4KReoA",
      "https://play-lh.googleusercontent.com/Y8cTilHEYBG1MhRLyOSH4SwGqxaPqgi2GvwIRivZ0FldpQcI95fYBrLAAK9ynaK_1k4-2qtioJUV9r71QMooSg",
      "https://play-lh.googleusercontent.com/i4qnGrfl0D5Qn-fZxIeFuj1aaKlQ7xefy7r5vNBWgErI7kJqnycTOIJE8kqkBTNxnKfK_aplCf2q_MMXppKdXw",
    ],
  },
  {
    slug: "gemini",
    urls: [
      "https://play-lh.googleusercontent.com/fv4FpDNq6Bk0yON6tTTPD4KuxZlIe2OGDsWBc5AGFbKyT4Dl2NWEpYOlu-oFZ22uaf_EVndnmP0J0-aGvaP7xg",
      "https://play-lh.googleusercontent.com/ALIvA5r5OCJofGeMMiv_K4M8hcREJSBOKA13hcv3G2Ljl3Rdd60AS7plZImz5j3mdih2CFWd8Akdn9tqXvcC9rU",
      "https://play-lh.googleusercontent.com/dlTX3OLpCBQ4AXhVh1hTkN-ya3AVY9hJg7FBLu0lMufjYlY2VxTn3l91vKakdqp93pxk-RE175mS9Z_rfWih4lo",
    ],
  },
  {
    slug: "grok",
    urls: [
      "https://play-lh.googleusercontent.com/geEp1rcUqZ3UQyU0uOrinYK186p7wJIGidVnYkURICseJvHqldMare2_NhxeoARrjzBPchlnzjszMkL_eXxW7A",
      "https://play-lh.googleusercontent.com/D4vM0d3XDSUGVmOVYujaEJ-RjZ0tR1-WVhQfBeJCp0ZykMHU-vNe5fRNPQjWnetI8JubCTfACBekm82fGiHZ1A",
      "https://play-lh.googleusercontent.com/6Zatz2sxGSGVQjqo76WPejEAzG-Tv580y5pvaXaNDQ4VG7TF_aJNm1FqtkpmRhrLrbYBLslrudE41V24cTMloA",
    ],
  },
  {
    slug: "x",
    urls: [
      "https://play-lh.googleusercontent.com/V0Fui04S8jpx5Ib0tByOpsaUhTq3VxR8POtSvzycQxH3aj3-LJZA2XXSW5iyDF8aJMzikfuET2cbC0WE8IHe",
      "https://play-lh.googleusercontent.com/9VlDdg-PYd7PJkxe324CwF6l3aXS9VCjIr-NcX8n4oabLCxTssCdnCELZVxqBDt6fhGWi8-wE751Iy6Pova8",
      "https://play-lh.googleusercontent.com/iW-TrXQ_w_Ncq9J73mhhY6DF9gsEKIAz5amwjx0WI_l_1tuzayLzLPC4TyS0u_I7MjBq62KjIcsJCIzdwll4",
    ],
  },
];

async function download(url, destination) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "DigitalToolsGuide/1.0" }, signal: AbortSignal.timeout(45_000) });
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      await writeFile(destination, Buffer.from(await response.arrayBuffer()));
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
    }
  }
  throw lastError;
}

for (const app of appleApps) {
  const response = await fetch(`https://itunes.apple.com/lookup?id=${app.id}&country=us`);
  const data = await response.json();
  const screenshots = data.results?.[0]?.screenshotUrls?.slice(0, 3) ?? [];
  if (screenshots.length < 3) throw new Error(`${app.slug}: Apple截图不足3张`);
  const targetDir = path.join(root, "public", "guides", app.slug);
  await mkdir(targetDir, { recursive: true });
  for (const [index, source] of screenshots.entries()) {
    const extension = app.extension ?? "png";
    const highResolution = source.replace(/\/392x696bb\.(png|jpg)$/, `/1179x2096bb.${extension}`);
    await download(highResolution, path.join(targetDir, `official-${index + 1}.${extension}`));
  }
}

for (const app of googleApps) {
  const targetDir = path.join(root, "public", "guides", app.slug);
  await mkdir(targetDir, { recursive: true });
  for (const [index, source] of app.urls.entries()) {
    await download(`${source}=w1080-h1920-rw`, path.join(targetDir, `official-${index + 1}.webp`));
  }
}

await writeFile(
  path.join(root, "public", "guides", "official-screenshot-sources.json"),
  `${JSON.stringify({ checkedAt, appleApps, googleApps }, null, 2)}\n`,
);

console.log("Downloaded 24 official storefront screenshots.");
