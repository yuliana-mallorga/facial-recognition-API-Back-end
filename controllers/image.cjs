const { Input, Model } = require("clarifai-nodejs");

const handleApiCall = async (req, res) => {
  const imageUrl = req.body.input;
  
  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: "No se proporcionó una URL de imagen." });
  }

  const input = Input.getInputFromUrl({
    inputId: "test-image",
    imageUrl,
  });

  const model = new Model({
    authConfig: {
      pat: process.env.CLARIFAI_API_KEY,
      userId: process.env.USER_ID,
      appId: "Project-face-detection",
    },
    modelId: "face-detection",
  });

  model
    .predict({
      inputs: [input],
    })
    .then((response) => {
      const data = response?.[0].data?.regionsList;
      res.status(200).json({ data });
    })
    .catch((error) => {
      console.error("Error en handleApiCall:", error);
      res
        .status(500)
        .json({ error: "Error al procesar la imagen en Clarifai." });
    });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.status(200).json(Number(entries[0].entries));
    })
    .catch((err) => res.status(400).json("Unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
