import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import MyBookView from "./MyBookView";
import MyBookEdit from "./MyBookEdit";
import MyBookDelete from "./MyBookDelete";

// Updated initialBooks
const initialBooks = [
  {
    id: 1,
    title: "The Time Traveler's Guide",
    price: 25,
    category: "Science Fiction",
    publisher: "Time Press",
    ISBN: "978-123456780",
    releaseDateTime: "2025-04-30T10:00",
    tags: ["Adventure", "Time Travel"],
    description: "Explore time like never before.",
    coverImage: "https://example.com/cover1.jpg",
    filePath: "https://example.com/book1.pdf",
  },
  {
    id: 2,
    title: "Mystery of the Old Castle",
    price: 30,
    category: "Mystery",
    publisher: "Castle Books",
    ISBN: "978-123456781",
    releaseDateTime: "2025-05-05T14:30",
    tags: ["Mystery", "Thriller"],
    description: "Unravel the secrets of the old castle.",
    coverImage: "https://example.com/cover2.jpg",
    filePath: "https://example.com/book2.pdf",
  },
  {
    id: 3,
    title: "Adventures in Space",
    price: 28,
    category: "Fantasy",
    publisher: "Galaxy Publishers",
    ISBN: "978-123456782",
    releaseDateTime: "2025-06-01T09:15",
    tags: ["Space", "Adventure"],
    description: "Journey across the stars.",
    coverImage: "https://example.com/cover3.jpg",
    filePath: "https://example.com/book3.pdf",
  },
  {
    id: 4,
    title: "The Art of Cooking",
    price: 35,
    category: "Non-Fiction",
    publisher: "Chef's Choice",
    ISBN: "978-123456783",
    releaseDateTime: "2025-07-10T12:45",
    tags: ["Cooking", "Lifestyle"],
    description: "Master the art of fine cooking.",
    coverImage: "https://example.com/cover4.jpg",
    filePath: "https://example.com/book4.pdf",
  },
  {
    id: 5,
    title: "History Rewritten",
    price: 22,
    category: "History",
    publisher: "History House",
    ISBN: "978-123456784",
    releaseDateTime: "2025-08-20T16:00",
    tags: ["History", "Culture"],
    description: "A new perspective on world events.",
    coverImage: "https://example.com/cover5.jpg",
    filePath: "https://example.com/book5.pdf",
  },
];

export default function MyBookTable() {
  const [books, setBooks] = useState(initialBooks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewBook, setViewBook] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);

  const handleView = (book) => {
    setViewBook(book);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditBook = (updatedBook) => {
    setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    setEditBook(null);
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter((b) => b.id !== id));
    setDeleteBook(null);
  };

  return (
    <Box sx={{ p: 3, minHeight: "78vh" }}>
      <Typography variant="h4" mb={3}>
        My Books
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#e0e0e0" }}>
            <TableRow>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Price</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Publisher</strong>
              </TableCell>
              <TableCell>
                <strong>ISBN</strong>
              </TableCell>
              <TableCell>
                <strong>Release Date & Time</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>${book.price}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>{book.publisher}</TableCell>
                  <TableCell>{book.ISBN}</TableCell>
                  <TableCell>
                    {book.releaseDateTime
                      ? new Date(book.releaseDateTime).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleView(book)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => setEditBook(book)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteBook(book)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={books.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <MyBookView
        open={!!viewBook}
        onClose={() => setViewBook(null)}
        book={viewBook}
      />
      <MyBookEdit
        open={!!editBook}
        onClose={() => setEditBook(null)}
        book={editBook}
        onEdit={handleEditBook}
      />
      <MyBookDelete
        open={!!deleteBook}
        onClose={() => setDeleteBook(null)}
        book={deleteBook}
        onDelete={handleDeleteBook}
      />
    </Box>
  );
}
