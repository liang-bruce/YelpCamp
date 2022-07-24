const mongoose = require("mongoose");
const cities = require("./au");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Picks one random array element
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random543 = Math.floor(Math.random() * 543);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "62d8a4629007e9436ab3f33e",
      location: `${cities[random543].city}, ${cities[random543].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa obcaecati, porronatus ipsum fuga dolor temporibus provident beatae perspiciatis ex sequi iusto suscipit. Pariatur, provident incidunt nesciunt quibusdam neque consectetur.",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dwlwzw4lm/image/upload/v1658557932/YelpCamp/wxss5t97hp1dtabcupng.jpg",
          filename: "YelpCamp/wxss5t97hp1dtabcupng",
        },
        {
          url: "https://res.cloudinary.com/dwlwzw4lm/image/upload/v1658557932/YelpCamp/o45wxyjtpryyyqb22gju.jpg",
          filename: "YelpCamp/o45wxyjtpryyyqb22gju",
        },
        {
          url: "https://res.cloudinary.com/dwlwzw4lm/image/upload/v1658557932/YelpCamp/ru1zudha9fkpcxapk1bf.jpg",
          filename: "YelpCamp/ru1zudha9fkpcxapk1bf",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
