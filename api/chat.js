const cors = require('cors');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "Mesaj daxil edilməyib" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Sen peşəkar həkim asistansan. İstifadəçilərin tibbi suallarına dəqiq, mərhəmətli və aydın Azərbaycan dilində cavab ver. Şiddətli ağrılarda həkimə müraciət etməyi tövsiyə et."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Süni intellekt cavab verə bilmədi, xahiş olunur bir az sonra yenidən cəhd edin.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Server xətası baş verdi." });
  }
};
