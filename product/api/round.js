const VIDEOS = require("./videos");

async function liveViews(ids, key) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids.join(",")}&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const map = {};
  for (const item of data.items || []) {
    map[item.id] = parseInt(item.statistics.viewCount, 10);
  }
  return map;
}

function pickPair() {
  const a = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
  let b = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
  while (b.id === a.id) b = VIDEOS[Math.floor(Math.random() * VIDEOS.length)];
  return [a, b];
}

module.exports = async (req, res) => {
  try {
    const [a, b] = pickPair();
    const key = process.env.YOUTUBE_API_KEY;
    let views = {};

    if (key) views = (await liveViews([a.id, b.id], key)) || {};

    const videoA = { id: a.id, title: a.title, views: views[a.id] || a.views };
    const videoB = { id: b.id, title: b.title, views: views[b.id] || b.views };

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ videoA, videoB });
  } catch (e) {
    res.status(500).json({ error: "Failed to load round" });
  }
};
