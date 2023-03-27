import { useSessionContext } from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";

interface todo {
  todo: string;
}

export default function StaffToDo() {
  const { session } = useSessionContext();

  const { data } = api.retrieveAllTasks.getTasks.useQuery({
    text: session?.user.id as string,
  });

  console.log("todo", data);
  if (Array.isArray(data)) {
    return (
      <>
        {/* {data?.map((task) => (
          <div key={task.id}>
            <p>Task: {task.description}</p>
            <p>Due Date: {task.complete_by}</p>
            <p>Importance: {task.importance}</p>
          </div>
        ))} */}
      </>
    );
  } else {
    return;
    <>No Tasks</>;
  }
}
