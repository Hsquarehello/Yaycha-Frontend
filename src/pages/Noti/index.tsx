import { Box, Button, Alert } from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../ThemedApp";
import { fetchNotis, putAllNotisRead, putNotiRead } from "../../lib/fetcher.js";
import type { Noti } from "../../types/noti.js";
import Loading from "../../components/Loading.js";
import NotiItem from "../../components/NotiItem.js";

export default function Notis() {
  // Fetch Notification
  const { isLoading, isError, error, data } = useQuery<Noti[]>({
    queryKey: ["notis"],
    queryFn: fetchNotis,
  });

  // Mark All as Read
  const readAllNotis = useMutation({
    mutationFn: putAllNotisRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notis"] });

      const previousNotis = queryClient.getQueryData<Noti[]>(["notis"]);

      queryClient.setQueryData<Noti[]>(["notis"], (old) => {
        if (!old) return [];
        return old.map((noti) => ({ ...noti, read: true }));
      });

      return previousNotis;
    },
    onError: (_err, _variables, context) => {
      const ctx = context as { previousNotis?: Noti[] } | undefined;
      if (ctx?.previousNotis) {
        queryClient.setQueryData(["notis"], ctx.previousNotis);
      }
    },
    onSettled: () => {
      // Server နဲ့ Data အမြဲ တိုက်ဆိုင်နေစေရန် Refresh လုပ်ပေးမည်
      queryClient.invalidateQueries({ queryKey: ["notis"] });
    },
  });

  // Mark Single Noti as Read
  const readNoti = useMutation({
    mutationFn: (id: number) => putNotiRead(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["notis"] });

      const previousNotis = queryClient.getQueryData<Noti[]>(["notis"]);

      queryClient.setQueryData<Noti[]>(["notis"], (old) => {
        if (!old) return [];
        return old.map((noti) =>
          noti.id === id ? { ...noti, read: true } : noti,
        );
      });

      return { previousNotis };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotis) {
        queryClient.setQueryData(["notis"], context.previousNotis);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notis"] });
    },
  });

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }
  if (isLoading) {
    return <Loading message="Loading..." />;
  }
  return (
    <Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }}></Box>
        <Button
          size="small"
          variant="outlined"
          sx={{ borderRadius: 5 }}
          onClick={() => readAllNotis.mutate()}>
          Mark all as read
        </Button>
      </Box>

      {data &&
        data.map((noti) => {
          return (
            <NotiItem noti={noti} readNoti={(id) => readNoti.mutate(id)} />
          );
        })}
    </Box>
  );
}
