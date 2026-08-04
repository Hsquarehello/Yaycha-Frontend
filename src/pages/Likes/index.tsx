import { Box, Alert } from "@mui/material";
import UserList from "../../components/UserList";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLikesOrComment } from "../../lib/fetcher";
import Loading from "../../components/Loading";

export default function Likes() {
  const { id, type } = useParams<{ id: string; type: "post" | "comment" }>();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["like"],
    queryFn: () => fetchLikesOrComment(id!, type!),
    enabled: Boolean(id && type),
  });

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Loading message="Loading users...." />;
  }

  return (
    <Box>
      <UserList title="Likes" data={data} />
    </Box>
  );
}
