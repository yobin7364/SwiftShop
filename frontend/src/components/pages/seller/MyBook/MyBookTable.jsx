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

const initialBooks = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `Book Title ${index + 1}`,
  price: 20 + index,
  category: "Fantasy",
  publisher: "Publisher X",
  ISBN: `978-12345678${index}`,
  releaseDate: `2025-01-${(index + 1).toString().padStart(2, "0")}`,
  tags: "Adventure, Action",
  language: "English",
  description: "Sample description for book...",
  coverImage: `https://example.com/cover${index + 1}.jpg`,
  filePath: `https://example.com/book${index + 1}.pdf`,
}));

export default function MyBookTable() {
  const [books, setBooks] = useState(initialBooks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewBook, setViewBook] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);

  // on clicking view icon
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
    setEditBook(null); // Close the Edit popup after saving
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
                <strong>Release Date</strong>
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
                  <TableCell>{book.releaseDate}</TableCell>
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
        onDelete={(id) => {
          setBooks(books.filter((b) => b.id !== id));
        }}
      />
    </Box>
  );
}
