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
  IconButton,
  TablePagination,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DiscountEdit from "./DiscountEdit";
import DiscountDelete from "./DiscountDelete";

export default function DiscountTable() {
  const initialBooks = [
    {
      id: 1,
      title: "The Psychology of Money",
      price: 25,
      discount: 10,
      startDateTime: "2025-05-01T10:00",
      endDateTime: "2025-05-10T23:59",
    },
    {
      id: 2,
      title: "Atomic Habits",
      price: 30,
      discount: 15,
      startDateTime: "2025-06-01T09:00",
      endDateTime: "2025-06-05T22:00",
    },
    {
      id: 3,
      title: "Deep Work",
      price: 20,
      discount: 5,
      startDateTime: "2025-07-01T08:00",
      endDateTime: "2025-07-03T20:00",
    },
    {
      id: 4,
      title: "Start With Why",
      price: 28,
      discount: 0,
      startDateTime: "2025-08-01T12:00",
      endDateTime: "2025-08-02T18:00",
    },
    {
      id: 5,
      title: "The Alchemist",
      price: 22,
      discount: 20,
      startDateTime: "2025-09-01T10:00",
      endDateTime: "2025-09-05T23:00",
    },
    {
      id: 6,
      title: "Thinking Fast and Slow",
      price: 32,
      discount: 12,
      startDateTime: "2025-10-01T09:00",
      endDateTime: "2025-10-10T20:00",
    },
    {
      id: 7,
      title: "Grit",
      price: 27,
      discount: 8,
      startDateTime: "2025-11-01T08:30",
      endDateTime: "2025-11-05T19:00",
    },
    {
      id: 8,
      title: "Dare to Lead",
      price: 24,
      discount: 10,
      startDateTime: "2025-12-01T07:00",
      endDateTime: "2025-12-03T21:00",
    },
  ];

  const [books, setBooks] = useState(initialBooks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDiscount, setEditDiscount] = useState(null);
  const [deleteDiscount, setDeleteDiscount] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditDiscount = (updatedDiscount) => {
    setBooks(
      books.map((b) => (b.id === updatedDiscount.id ? updatedDiscount : b))
    );
    setEditDiscount(null);
  };

  return (
    <Box sx={{ p: 3, minHeight: "78vh" }}>
      <Typography variant="h4" mb={3}>
        Discounts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#e0e0e0" }}>
            <TableRow>
              <TableCell>
                <strong>Title</strong>
              </TableCell>
              <TableCell>
                <strong>Original Price</strong>
              </TableCell>
              <TableCell>
                <strong>Discount %</strong>
              </TableCell>
              <TableCell>
                <strong>Discounted Price</strong>
              </TableCell>
              <TableCell>
                <strong>Start Date & Time</strong>
              </TableCell>
              <TableCell>
                <strong>End Date & Time</strong>
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
                  <TableCell>{book.discount}%</TableCell>
                  <TableCell>
                    ${(book.price * (1 - book.discount / 100)).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(book.startDateTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(book.endDateTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => setEditDiscount(book)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDiscount(book)}
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

      {/* Discount Edit Popup */}
      <DiscountEdit
        open={!!editDiscount}
        onClose={() => setEditDiscount(null)}
        book={editDiscount}
        onEdit={handleEditDiscount}
      />

      {/* Discount Delete Popup */}
      <DiscountDelete
        open={!!deleteDiscount}
        onClose={() => setDeleteDiscount(null)}
        book={deleteDiscount}
        onDelete={(id) => {
          setBooks(books.filter((b) => b.id !== id));
        }}
      />
    </Box>
  );
}
