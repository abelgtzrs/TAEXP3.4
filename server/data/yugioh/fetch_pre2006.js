const axios = require("axios");
const fs = require("fs");

async function fetchPre2006Cards() {
  const { data } = await axios.get("https://db.ygoprodeck.com/api/v7/cardinfo.php", {
    params: { enddate: "2005-12-31", dateregion: "tcg" },
  });

  const cards = data.data.map((card) => ({
    name: card.name,
    description: card.desc,
    image: card.card_images?.[0]?.image_url,
    attack: card.atk ?? null,
    defense: card.def ?? null,
    level: card.level ?? null,
    type: card.type,
    attribute: card.attribute ?? null,
    rarity: card.card_sets?.[0]?.set_rarity ?? null,
  }));

  fs.writeFileSync("cards_pre2006.json", JSON.stringify(cards, null, 2), "utf-8");

  console.log(`Wrote ${cards.length} cards to cards_pre2006.json`);
}

fetchPre2006Cards().catch(console.error);
