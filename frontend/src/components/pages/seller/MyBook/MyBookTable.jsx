import React, { useEffect, useState } from "react";
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
  Tooltip,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Edit, Delete, Visibility, RateReview } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { getSellerBookAction } from "../../../../action/BookAction";
import MyBookView from "./MyBookView";
import MyBookEdit from "./MyBookEdit";
import MyBookDelete from "./MyBookDelete";
import SellerReviewDialog from "./SellerReviewDialog";

export default function MyBookTable() {
  const dispatch = useDispatch();
  const { myBooks, loadingMyBooks } = useSelector((state) => state.sellerBook);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewBook, setViewBook] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [deleteBook, setDeleteBook] = useState(null);
  const [reviewBookId, setReviewBookId] = useState(null);

  useEffect(() => {
    dispatch(getSellerBookAction({ query: "", page: page + 1 }));
  }, [dispatch, page]);

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
    setEditBook(null);
  };

  const handleDeleteBook = (id) => {
    setDeleteBook(null);
  };

  const books = myBooks?.books || [];
  const totalPages = myBooks?.totalPages || 1;
  const totalBooks = myBooks?.totalBooks || books.length;

  return (
    <Box sx={{ p: 3, minHeight: "78vh" }}>
      <Typography variant="h4" mb={1}>
        My Books
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search books..."
          variant="outlined"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              dispatch(getSellerBookAction({ query: e.target.value, page: 1 }));
            }
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {loadingMyBooks ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
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
                  <strong>Publisher</strong>
                </TableCell>
                <TableCell>
                  <strong>ISBN</strong>
                </TableCell>
                <TableCell>
                  <strong>Release Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Published</strong>
                </TableCell>
                <TableCell>
                  <strong>Reviews</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>${book.discountedPrice}</TableCell>
                  <TableCell>{book.publisher}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>
                    {new Date(book.releaseDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {book.isPublished ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CloseIcon color="error" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Reviews">
                      <IconButton
                        color="primary"
                        onClick={() => setReviewBookId(book._id)}
                      >
                        <RateReview />
                      </IconButton>
                    </Tooltip>
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
            count={totalBooks}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={5}
            rowsPerPageOptions={[]}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${Math.min(to, count)} of ${count}`
            }
          />
        </TableContainer>
      )}

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
      <SellerReviewDialog
        open={!!reviewBookId}
        onClose={() => setReviewBookId(null)}
        bookId={reviewBookId}
      />
    </Box>
  );
}
