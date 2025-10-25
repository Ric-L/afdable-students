import React, { useMemo } from "react";
import { useGetQuery } from "../../react-query/hooks/queryHooks";
import { queryConfig } from "../../react-query/queryConfig";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TablePagination,
  Chip,
  Typography,
  type TableContainerProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

// Define interfaces for type safety
interface EnrollmentRequest {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  student_grade: string;
  student_board_type: string;
  course_id: number;
  course_name: string;
  promo_code_id: number | null;
  promo_code: string | null;
  original_price: number;
  discounted_price: number;
  status: "pending" | "approved" | "rejected";
  student_notes: string;
  requested_at: string;
  processed_at: string | null;
  processed_by: number | null;
  created_enrollment_id: number | null;
}

// Styled components for better visuals
const StyledTableContainer = styled(TableContainer)<TableContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(4),
  maxWidth: "100%",
  overflowX: "auto",
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  backgroundColor: status === "approved" ? theme.palette.success.light : status === "rejected" ? theme.palette.error.light : theme.palette.warning.light,
  color: status === "approved" ? theme.palette.success.contrastText : status === "rejected" ? theme.palette.error.contrastText : theme.palette.warning.contrastText,
}));

const EnrollmentRequest: React.FC = () => {
  const { queryFn, queryKeys } = queryConfig.useGetEnrollmentRequests;

  const {
    data: enrollmentResponse,
    isLoading,
    isError,
  } = useGetQuery({
    key: queryKeys,
    func: queryFn,
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const enrollmentData: EnrollmentRequest[] = (enrollmentResponse?.result.list as EnrollmentRequest[]) || [];

  // Memoize the formatted data to prevent unnecessary re-renders
  const formattedData = useMemo(() => {
    return enrollmentData.map((request) => ({
      ...request,
      requested_at: dayjs(request.requested_at).format("DD/MM/YYYY HH:mm"),
      processed_at: request.processed_at ? dayjs(request.processed_at).format("DD/MM/YYYY HH:mm") : "N/A",
      promo_code: request.promo_code || "None",
    }));
  }, [enrollmentData]);

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the displayed rows
  const displayedRows = useMemo(() => {
    return formattedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [formattedData, page, rowsPerPage]);

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !enrollmentResponse?.result) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load enrollment requests</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Enrollment Requests
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Original Price</TableCell>
              <TableCell>Discounted Price</TableCell>
              <TableCell>Promo Code</TableCell>
              <TableCell>Student Notes</TableCell>
              <TableCell>Requested At</TableCell>
              <TableCell>Processed At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.course_name}</TableCell>
                <TableCell>
                  <StatusChip label={row.status} status={row.status} size="small" />
                </TableCell>
                <TableCell>₹{row.original_price}</TableCell>
                <TableCell>₹{row.discounted_price}</TableCell>
                <TableCell>{row.promo_code}</TableCell>
                <TableCell>{row.student_notes}</TableCell>
                <TableCell>{row.requested_at}</TableCell>
                <TableCell>{row.processed_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={formattedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledTableContainer>
    </Container>
  );
};

export default EnrollmentRequest;
