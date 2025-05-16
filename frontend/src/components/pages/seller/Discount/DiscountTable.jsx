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
  IconButton,
  TablePagination,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DiscountEdit from "./DiscountEdit";
import DiscountDelete from "./DiscountDelete";
import { useDispatch, useSelector } from "react-redux";
import { getSellerDiscountedBookAction } from "../../../../action/DiscountAction";

export default function DiscountTable() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0); // MUI pagination is zero-based
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");

  const [editDiscount, setEditDiscount] = useState(null);
  const [deleteDiscount, setDeleteDiscount] = useState(null);

  const { discountedBooks, loadingGetDiscounted } = useSelector(
    (state) => state.sellerDiscount
  );

  useEffect(() => {
    dispatch(
      getSellerDiscountedBookAction({
        query,
        page: page + 1,
        limit: 5,
      })
    );
  }, [dispatch, query, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEditDiscount = (updatedDiscount) => {
    setEditDiscount(null);
    dispatch(
      getSellerDiscountedBookAction({
        query,
        page: page + 1,
        limit: 5,
      })
    );
  };

  const handleDeleteDiscount = (id) => {
    setDeleteDiscount(null);
    dispatch(
      getSellerDiscountedBookAction({
        query,
        page: page + 1,
        limit: 5,
      })
    );
  };

  return (
    <Box sx={{ p: 3, minHeight: "78vh" }}>
      <Typography variant="h4" mb={3}>
        Discounts
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search Discounted Books..."
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setQuery(searchText);
              setPage(0);
            }
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {loadingGetDiscounted ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
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
              {discountedBooks?.books?.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>${book.price}</TableCell>
                  <TableCell>{book.discountPercentage}%</TableCell>
                  <TableCell>${book.discountedPrice}</TableCell>
                  <TableCell>
                    {new Date(book.discountStart).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(book.discountEnd).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {/* <IconButton
                      color="primary"
                      onClick={() => setEditDiscount(book)}
                    >
                      <Edit />
                    </IconButton> */}
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
            count={discountedBooks?.totalBooks || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={5}
            rowsPerPageOptions={[]} // disable dropdown
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${Math.min(to, count)} of ${count}`
            }
          />
        </TableContainer>
      )}

      <DiscountEdit
        open={!!editDiscount}
        onClose={() => setEditDiscount(null)}
        book={editDiscount}
        onEdit={handleEditDiscount}
      />

      <DiscountDelete
        open={!!deleteDiscount}
        onClose={() => setDeleteDiscount(null)}
        book={deleteDiscount}
        onDelete={handleDeleteDiscount}
      />
    </Box>
  );
}
