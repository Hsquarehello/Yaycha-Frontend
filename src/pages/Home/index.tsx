import { useState } from "react";
import type {JSX} from "react";
import { Box } from "@mui/material";
import Form from "../../components/Form";
import Item from "../../components/Item";

import { useApp } from "../../ThemedApp";

interface Item {
  id: number;
  content: string;
  name: string;
}

export default function Home():JSX.Element {
  const { showForm, setGlobalMsg } = useApp();
  const [data, setData] = useState<Item[]>([
    { id: 3, content: "Yay, interesting.", name: "Chris" },
    { id: 2, content: "React is fun.", name: "Bob" },
    { id: 1, content: "Hello, World!", name: "Alice" },
  ]);

  const remove = (id: number | string):void => {
    setData(data.filter((item) => item.id !== id));
    setGlobalMsg("Item removed successfully.");
  };

  const add = (content: string, name: string):void => {
    const id = data[0].id + 1;
    setData([{ id, content, name }, ...data]);
    setGlobalMsg("An item added");
  };

  return (
    <Box>
      {showForm && <Form add={add} />}
      {data.map((item) => {
        return <Item key={item.id} item={item} remove={remove} />;
      })}
    </Box>
  );
}
