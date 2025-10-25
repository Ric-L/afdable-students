import React from "react";
import { useGetQuery } from "../../react-query/hooks/queryHooks";
import { queryConfig } from "../../react-query/queryConfig";
import { Container, Card, CardContent, Typography, Grid, Box, Avatar, Divider, CircularProgress, Alert } from "@mui/material";
import { Person, Email, Phone, School, CalendarToday, Update } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Define the profile data interface
interface ProfileData {
  id: number;
  username: string;
  password: string;
  email: string;
  full_name: string;
  phone: string;
  grade: string;
  board_type: string;
  is_active: number;
  last_login: string;
  created_on: string;
  updated_at: string;
}

// Styled components for better layout
const ProfileCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1.5),
  "& svg": {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const Profile: React.FC = () => {
  const { queryFn, queryKeys } = queryConfig.useGetProfile;

  const {
    data: profileResponse,
    isLoading,
    isError,
  } = useGetQuery({
    key: queryKeys,
    func: queryFn,
  });

  // const profileData: ProfileData = (profileResponse?.result as ProfileData) || [];
  const profileData = (profileResponse?.result ?? null) as ProfileData | null;

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !profileData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load profile data</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileCard>
        <CardContent>
          <AvatarContainer>
            <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>{profileData.full_name.charAt(0).toUpperCase()}</Avatar>
          </AvatarContainer>
          <Typography variant="h5" align="center" gutterBottom>
            {profileData?.full_name}
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
            @{profileData?.username}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <InfoItem>
                <Email />
                <Typography variant="body1">{profileData.email}</Typography>
              </InfoItem>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <InfoItem>
                <Phone />
                <Typography variant="body1">{profileData.phone}</Typography>
              </InfoItem>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <InfoItem>
                <School />
                <Typography variant="body1">
                  Grade {profileData.grade} ({profileData.board_type})
                </Typography>
              </InfoItem>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <InfoItem>
                <CalendarToday />
                <Typography variant="body1">Joined: {new Date(profileData.created_on).toLocaleDateString()}</Typography>
              </InfoItem>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <InfoItem>
                <Update />
                <Typography variant="body1">Last Login: {new Date(profileData.last_login).toLocaleString()}</Typography>
              </InfoItem>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <InfoItem>
                <Person />
                <Typography variant="body1">Status: {profileData.is_active === 0 ? "Active" : "Inactive"}</Typography>
              </InfoItem>
            </Grid>
          </Grid>
        </CardContent>
      </ProfileCard>
    </Container>
  );
};

export default Profile;
