import React, { useState } from "react";
import { useGetQuery, useMutationQuery } from "../../react-query/hooks/queryHooks";
import { queryConfig, mutationConfig } from "../../react-query/queryConfig";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Alert, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { showNotification } from "../../utils";

// Define interfaces for type safety
interface ActiveCourse {
  id: number;
  title: string;
  description: string;
  subject: string;
  board_type: string;
  grade_level: string;
  start_date: string;
  end_date: string;
  current_students: number;
  price: number;
  instructor_name: string;
  thumbnail_url: string;
  is_active: boolean;
  class_time: string;
  created_at: string;
  updated_at: string;
}

export type TCreateEnrollmentRequest = {
  course_id: number;
  original_price: number;
  discounted_price: number;
  promo_code_id?: number;
  student_notes?: string;
};

// Styled components for better visuals
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[6],
  },
}));

const CardMediaStyled = styled(CardMedia)({
  height: 140,
  backgroundSize: "cover",
});

const CardContentStyled = styled(CardContent)({
  flexGrow: 1,
});

const ActiveCourses: React.FC = () => {
  const { queryFn, queryKeys } = queryConfig.useGetActiveCourses;
  const { mutationFn, queryKey } = mutationConfig.useAddEnrollmentRequest;

  const { mutate: addEnrollment, isPending: updating } = useMutationQuery({
    func: mutationFn,
    invalidateKey: queryKey,
    onSuccess: () => {
      showNotification("Enrollment Request Submitted Successfully", "success");
      setOpenDialog(false);
      setFormData({ promo_code_id: "", student_notes: "" });
    },
    onError: () => showNotification("Failed to submit enrollment request", "error"),
  });

  const {
    data: activeCourseData,
    isLoading,
    isError,
  } = useGetQuery({
    key: queryKeys,
    func: queryFn,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ActiveCourse | null>(null);
  const [formData, setFormData] = useState<{
    promo_code_id: string;
    student_notes: string;
  }>({ promo_code_id: "", student_notes: "" });

  // Memoize courses to prevent unnecessary re-renders, without formatting
  const courses: ActiveCourse[] = (activeCourseData?.result?.list as ActiveCourse[]) || [];

  const handleOpenDialog = (course: ActiveCourse) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ promo_code_id: "", student_notes: "" });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEnrollment = () => {
    if (selectedCourse) {
      const payload: TCreateEnrollmentRequest = {
        course_id: selectedCourse.id,
        original_price: selectedCourse.price,
        discounted_price: selectedCourse.price, // Assuming no discount for simplicity
        promo_code_id: formData.promo_code_id ? Number(formData.promo_code_id) : undefined,
        student_notes: formData.student_notes || undefined,
      };
      addEnrollment(payload);
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !activeCourseData?.result) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load active courses</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Active Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
            <StyledCard>
              <CardMediaStyled image={course.thumbnail_url} title={course.title} />
              <CardContentStyled>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Subject:</strong> {course.subject}
                </Typography>
                <Typography variant="body2">
                  <strong>Board:</strong> {course.board_type}
                </Typography>
                <Typography variant="body2">
                  <strong>Grade:</strong> {course.grade_level}
                </Typography>
                <Typography variant="body2">
                  <strong>Instructor:</strong> {course.instructor_name}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {dayjs(course.start_date).format("DD/MM/YYYY")} - {dayjs(course.end_date).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="body2">
                  <strong>Class Time:</strong> {dayjs(course.class_time, "HH:mm:ss").format("HH:mm")}
                </Typography>
                <Typography variant="body2">
                  <strong>Students:</strong> {course.current_students}
                </Typography>
                <Typography variant="body2">
                  <strong>Price:</strong> ₹{course.price}
                </Typography>
              </CardContentStyled>
              <Box sx={{ p: 2 }}>
                <Button variant="contained" color="primary" fullWidth onClick={() => handleOpenDialog(course)} disabled={updating}>
                  {updating && selectedCourse?.id === course.id ? "Submitting..." : "Enroll Now"}
                </Button>
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Enrollment Request Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Enroll in {selectedCourse?.title}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Promo Code ID (Optional)" name="promo_code_id" value={formData.promo_code_id} onChange={handleFormChange} margin="normal" type="number" />
          <TextField fullWidth label="Student Notes (Optional)" name="student_notes" value={formData.student_notes} onChange={handleFormChange} margin="normal" multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitEnrollment} disabled={updating}>
            {updating ? "Submitting..." : "Submit Enrollment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ActiveCourses;
