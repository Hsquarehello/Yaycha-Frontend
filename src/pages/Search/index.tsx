import {
  Alert,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "../../lib/fetcher";
import FollowButton from "../../components/FollowButton";
import { useDebounce } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

export default function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => fetchSearch(debouncedQuery),
    enabled: Boolean(debouncedQuery),
  });

  return (
    <Box>
      <TextField
        fullWidth={true}
        variant="outlined"
        placeholder="Search user"
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
        }}
      />

      {isError && (
        <Box>
          <Alert severity="warning" sx={{ mt: 2 }}>
            {error instanceof Error ? error.message : "An error occurred"}
          </Alert>
        </Box>
      )}

      {isLoading && <Loading message="Searching Users..." />}

      {!isLoading && !isError && debouncedQuery && data?.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: "center" }}>
          No users found.
        </Typography>
      )}

      {!isLoading && data && data.length > 0 && (
        <List>
          {data.map((user) => {
            return (
              <ListItem key={user.id}>
                <ListItemButton onClick={() => navigate(`/profile/${user.id}`)}>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.bio} />
                </ListItemButton>
                
                <ListItemSecondaryAction>
                  <FollowButton user={user} />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
