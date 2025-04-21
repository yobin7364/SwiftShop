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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DiscountTable() {
  const initialBooks = [
    { id: 1, title: "The Psychology of Money", price: 25, discount: 10 },
    { id: 2, title: "Atomic Habits", price: 30, discount: 15 },
    { id: 3, title: "Deep Work", price: 20, discount: 5 },
    { id: 4, title: "Start With Why", price: 28, discount: 0 },
    { id: 5, title: "The Alchemist", price: 22, discount: 20 },
    { id: 6, title: "Thinking Fast and Slow", price: 32, discount: 12 },
    { id: 7, title: "Grit", price: 27, discount: 8 },
    { id: 8, title: "Dare to Lead", price: 24, discount: 10 },
  ];

  const [books, setBooks] = useState(initialBooks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
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
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
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
    </Box>
  );
}
