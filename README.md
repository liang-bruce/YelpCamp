# Yelp Camp Project

## Learned from The Web Developer Bootcamp 2022 - Udemy

Following RESTful API pattern

## Stacks, Libraries & Frameworks

Database: MongoDB, Mongoose <br>
Backend: Javascript, Node.js, express, ejs, ejs-mate, RESTful routes, MVC(model, view, controller) pattern <br>
Frontend: HTML, CSS, bootstrap5 <br>
Deploy: Heroku <br>

Library & middleware:
express-session, connect-flash<br>
passport - authentication<br>
starability - star review<br>
multer, cloudinary, multer storage cloudinary - upload file (image)<br>
dotenv - environment variables<br>
express-mongo-sanitize - prevent Mongo injection<br>
sanitize-html - disable html components insertion<br>
connect-mongo - store session in mongo not in memory<br>

## Data Validation

Client side - booststrap & js Error <br>
Server side - JOI library<br>

## Data notes

One campground has many reviews - review stored as an array in campground attribute: reviews <br>

- Deleting one campground will also delete all reviews <br>
  <br>
  Mongoose virtual property used for Image thumbnail & cluster map popup text

## Seeds Folder

Only to be runned when Mongo Schema is updated/ Changed
