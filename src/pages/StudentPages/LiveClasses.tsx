import React from "react";
import { useGetQuery } from "../../react-query/hooks/queryHooks";
import { queryConfig } from "../../react-query/queryConfig";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Alert, Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

// Define interfaces for type safety
interface LiveClass {
  course_id: number;
  live_link: string;
  created_on: string;
  course_title: string;
  subject: string;
  board_type: string;
  grade_level?: string;
  instructor_name?: string;
  thumbnail_url?: string;
  start_date: string;
  end_date: string;
  enrollment_id: number;
  enrolled_at: string;
  status: string;
  topic?: string;
}

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

const StatusChip = styled(Chip)<{ isLive: boolean }>(({ theme, isLive }) => ({
  backgroundColor: isLive ? theme.palette.success.light : theme.palette.error.light,
  color: isLive ? theme.palette.success.contrastText : theme.palette.error.contrastText,
}));

const LiveClasses: React.FC = () => {
  const { queryFn, queryKeys } = queryConfig.useGetClassLinks;

  const { data, isLoading, error } = useGetQuery({
    key: queryKeys,
    func: queryFn,
    params: { offset: 0, limit: 10 },
  });

  // Memoize courses to prevent unnecessary re-renders
  const courses: LiveClass[] = (data?.result.list as LiveClass[]) || [];

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !data?.result) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load live classes</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Live Classes
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => {
          const isLive = course.live_link !== "";
          return (
            <Grid size={{ xs: 12, md: 4, sm: 6 }} key={course.course_id}>
              <StyledCard>
                <CardMediaStyled image={course.thumbnail_url || "https://via.placeholder.com/140"} title={course.course_title} />
                <CardContentStyled>
                  <Typography variant="h6" gutterBottom>
                    {course.course_title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course.topic || "No topic specified"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Subject:</strong> {course.subject}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Board:</strong> {course.board_type}
                  </Typography>
                  {course.grade_level && (
                    <Typography variant="body2">
                      <strong>Grade:</strong> {course.grade_level}
                    </Typography>
                  )}
                  {course.instructor_name && (
                    <Typography variant="body2">
                      <strong>Instructor:</strong> {course.instructor_name}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Duration:</strong> {dayjs(course.start_date).format("DD/MM/YYYY")} - {dayjs(course.end_date).format("DD/MM/YYYY")}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Enrolled At:</strong> {dayjs(course.enrolled_at).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> <StatusChip label={isLive ? "Live" : "Not Live"} isLive={isLive} size="small" />
                  </Typography>
                </CardContentStyled>
                {isLive && (
                  <Box sx={{ p: 2 }}>
                    <Button variant="contained" color="primary" fullWidth href={course.live_link} target="_blank" rel="noopener noreferrer">
                      Join Live Class
                    </Button>
                  </Box>
                )}
              </StyledCard>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default LiveClasses;
