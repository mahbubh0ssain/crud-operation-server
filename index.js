const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mahbubh0ssain:NEMfe65oHFYs2Qx3@mng-products.msvhyox.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("DB connect successfully.");
  } catch (error) {
    console.error(error.massage);
  }
};
dbConnect();

const Products = client.db("mng-products").collection("veg");

app.post("/add", async (req, res) => {
  try {
    const result = await Products.insertOne(req.body);
    if (result.insertedId) {
      res.send({
        success: true,
        message: `successfully added the product ${req.body.name}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the product",
      });
    }
  } catch (error) {
    res.send(error.massage);
  }
});

app.get("/", async (req, res) => {
  const cursor = Products.find({});
  const products = await cursor.toArray();
  res.send({
    success: true,
    data: products,
  });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findOne({ _id: ObjectId(id) });
    res.send({
      success: true,
      data: product,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.patch("/edit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Products.updateOne(
      { _id: ObjectId(id) },
      { $set: req.body }
    );
    if (result.matchedCount) {
      res.send({
        success: true,
        message: `successfully updated ${req.body.name}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't update  the product",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // for security purpose
    const product = await Products.findOne({ _id: ObjectId(id) });
    if (!product._id) {
      res.send({
        success: false,
        error: "Product does not exist.",
      });
      return;
    }
    //--------

    const result = await Products.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount) {
      res.send({
        success: true,
        message: "Product deleted",
      });
    } else {
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("Server is running on", port);
});
