import express from "express";
const router = express.Router();
import passport from "passport";
import { validateBook } from "../../validator/book.validator.js";
import Book from "../../models/Book.module.js";

//this points to /api/book/test or any route ending with /test
//@route  GET /api/book/test
//@desc   Tests post route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "Book Works" }));

//@route  GET /api/book/search
//@desc   Get books with search query
//@access Public
// Always define general GET routes before ID-based GET routes
// to prevent route conflicts and ensure correct request handling.

router.get("/search", async (req, res) => {
  const { query = "", page = 1, limit = 10 } = req.query; // Extract query, page, and limit
  const searchRegex = new RegExp(query, "i"); // Case-insensitive searchs

  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ],
    })

      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "name email",
      });
    res.status(200).json({
      message: "Books retrieved successfully",
      books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//@route  GET /api/book/myBooks
//@desc   Get books uploaded by the logged-in user
//@access Private
router.get(
  "/myBooks",
  passport.authenticate("jwt", { session: false }), // Ensure user is authenticated
  async (req, res) => {
    const { query = "", page = 1, limit = 10 } = req.query; // Extract query, page, and limit
    const searchRegex = new RegExp(query, "i"); // Case-insensitive searchs

    try {
      // Find books uploaded by the logged-in user (using req.user.id)
      const books = await Book.find({
        author: req.user.id,

        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
        ],
      })
        .skip((page - 1) * limit) // Skip for pagination
        .limit(limit) // Limit the number of books per page
        .sort({ createdAt: -1 });

      if (books.length === 0) {
        return res
          .status(404)
          .json({ message: "No books found for this user" });
      }

      res.status(200).json({ message: "Books retrieved successfully", books });
    } catch (error) {
      console.error("Error fetching user's books:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

//@route  GET /api/book/:id
//@desc   Get a single book by ID,
//@access Public
router.get("/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    // Find book by ID
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book retrieved successfully", book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//@route  GET /api/book
//@desc   Get all books with pagination
//@access Public
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Get pagination parameters

  try {
    const books = await Book.find()
      .skip((page - 1) * limit) // Skip books for the current page
      .limit(limit) // Limit number of books per page
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ message: "Books retrieved successfully", books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//@route  POST /api/book
//@desc   Create a new book
//@access Private (Only sellers)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Validate input
    const { errors, isValid } = validateBook(req.body);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid fields", errors });
    }

    try {
      const { title, price, category, description, filePath } = req.body;
      const author = req.user.id; // Get user ID from token

      // Ensure only sellers can add books
      if (!req.user.role.includes("seller")) {
        return res.status(403).json({ message: "Only sellers can add books" });
      }

      const book = new Book({
        title,
        author: req.user.id, //Store the user ID as the author
        price,
        category,
        description,
        file: {
          filePath,
        },
      });

      await book.save();
      res.status(201).json({ message: "Book uploaded successfully", book });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

//@route  PUT /api/book/:bookId
//@desc   Update book details
//@access Private

router.put(
  "/:bookId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Validate input
    const { errors, isValid } = validateBook(req.body);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid Fields", errors });
    }

    const userId = req.user.id;

    const { bookId } = req.params;
    const { title, price, category, description, filePath } = req.body;

    try {
      // Fetch current book
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Ensure only the book author can update it
      if (!book.author.equals(userId)) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this book" });
      }

      // Update book details
      book.title = title;
      book.price = price;
      book.category = category;
      book.description = description;
      book.file.filePath = filePath;

      await book.save();

      res.json({ message: "Book updated successfully", book });
    } catch (error) {
      console.error("Error updating book", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

//@route  DELETE /api/book/:bookId
//@desc   Delete a book
//@access Private

router.delete(
  "/:bookId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;

    try {
      // Fetch the book
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Check if the logged-in user is the author of the book
      if (!book.author.equals(userId)) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this book" });
      }

      // Delete the book
      await Book.findByIdAndDelete(bookId);

      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export default router;
