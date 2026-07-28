import { Alert, Avatar, Box, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import type { JSX } from "react";
import Item from "../../components/Item";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, type UserForProfile } from "../../lib/fetcher";
import type { Post } from "../../types/post";

export default function Profile(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { isLoading, isError, error, data } = useQuery<UserForProfile, Error>({
    queryKey: [`users/${id}`],
    queryFn: async () => fetchUser(id!),
    enabled: !!id,
  });

  const handleRemove = (): void => {
    // Post ဖျက်တဲ့ Logic ရေးရန်
  };

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

  return (
    <Box>
      {/* Profile Cover Banner */}
      <Box sx={{ bgcolor: "banner", height: 150, borderRadius: 4 }} />

      {/* Profile Avatar & Info Section */}
      <Box
        sx={{
          mb: 4,
          marginTop: "-60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}>
        <Avatar sx={{ width: 100, height: 100, bgcolor: pink[500] }} />
        <Box sx={{ textAlign: "center" }}>
          <Typography>{data?.username}</Typography>
          <Typography sx={{ fontSize: "0.8em", color: "text.fade" }}>
            {data?.bio}
          </Typography>
        </Box>
      </Box>

      {/* User Post Item */}
      {data && data.posts?.map((post: Post) => (
        <Item key={post.id} item={post} remove={handleRemove} />
      ))}

    </Box>
  );
}
