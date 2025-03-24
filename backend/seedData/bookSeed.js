import Book from "../models/Book.module.js";
import { faker } from "@faker-js/faker";

export const seedBooks = async (users) => {
  try {
    // Remove all existing Book in the collection to avoid duplication
    await Book.deleteMany();

    const books = [];

    // Filter users with the "seller" role
    const sellers = users.filter((user) => user.role.includes("seller"));

    // Each seller gets exactly 2 books
    sellers.forEach((seller) => {
      for (let i = 0; i < 2; i++) {
        books.push({
          title: faker.lorem.words(3),
          author: seller._id, // Assign real seller ID
          price: faker.commerce.price({ min: 5, max: 50, dec: 2 }),
          category: faker.commerce.department(),
          description: faker.lorem.sentences(2),
          coverImage: faker.image.url(), // Random image URL
          file: {
            filePath: `/uploads/books/${faker.string.uuid()}.pdf`, // Fake file path (Now correctly inside `file`)
          },
        });
      }
    });

    // Insert Book into DB
    await Book.insertMany(books);

    console.log("Books created successfully!");
  } catch (err) {
    console.error("Error while seeding Books:", err);
  }
};
