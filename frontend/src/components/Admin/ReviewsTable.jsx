import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  clearErrors,
  deleteReview,
  getAllReviews,
} from "../../actions/productAction";
import Rating from "@mui/material/Rating";
import Actions from "./Actions";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";

const ReviewsTable = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [productId, setProductId] = useState("");

  const { reviews, error } = useSelector((state) => state.reviews);
  const {
    loading,
    isDeleted,
    error: deleteError,
  } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getAllReviews());
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (deleteError) {
      enqueueSnackbar(deleteError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isDeleted) {
      enqueueSnackbar("Review Deleted Successfully", { variant: "success" });
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, deleteError, isDeleted, productId, enqueueSnackbar]);

  const deleteReviewHandler = (id, productId) => {
    dispatch(deleteReview(id, productId));
  };

  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: "productId",
      headerName: "Product ID",
      minWidth: 200,
      flex: 0.3,
    },
    {
      field: "user",
      headerName: "User",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 200,
      flex: 0.3,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => {
        return (
          <Rating
            readOnly
            value={params.row.rating}
            size="small"
            precision={0.5}
          />
        );
      },
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 180,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 60,
      flex: 0.3,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Actions
            editRoute={"review"}
            deleteHandler={deleteReviewHandler}
            id={params.row.id}
            productId={params.row.productId}
          />
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((rev) => {
      rows.push({
        id: rev._id,
        rating: rev.rating,
        comment: rev.comment,
        user: rev.name,
        productId: rev.productId,
        productName: rev.productName
      });
    });

  return (
    <>
      <MetaData title="Admin Reviews | Flipkart" />

      {loading && <BackdropLoader />}
      <div className="flex justify-between items-center gap-2 sm:gap-12">
        <h1 className="text-lg font-medium uppercase">reviews</h1>
      </div>
      <div
        className="bg-white rounded-xl shadow-lg w-full"
        style={{ height: 450 }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectIconOnClick
          sx={{
            boxShadow: 0,
            border: 0,
          }}
        />
      </div>
    </>
  );
};

export default ReviewsTable;
