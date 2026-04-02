import React, { useEffect, useState } from "react";
import { get, post } from "../api";

import Select from "./shared/form/Select";

function ChoreEditor({ onCreateChore }) {
    const [childOptions, setChildOptions] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]);
    const [loading, setLoading] = useState();
    const [animating, setAnimating] = useState(false);
    const [child, setChild] = useState();
    const [task, setTask] = useState();
    const [dueOn, setDueOn] = useState("");

    // Let's get the options for our two select menus
    useEffect(() => {
        setLoading(true);
        get(`/v1/children/`).then((response) => {
            setLoading(false);
            setChildOptions(
                response.data.map((child) => {
                    return {
                        label: child.attributes.name,
                        value: child.id,
                    };
                }),
            );
        });
        get(`/v1/tasks/`).then((response) => {
            setLoading(false);
            setTaskOptions(
                response.data.map((task) => {
                    return {
                        label: task.attributes.name,
                        value: task.id,
                    };
                }),
            );
        });
    }, []);

    function createChore() {
        setAnimating(true);
        post(`/v1/create_chore`, {
            chore: {
                child_id: child,
                task_id: task,
                due_on: dueOn,
            },
        }).then((data) => {
            if (data.errors) {
                console.log(data.errors);
            } else {
                onCreateChore(data);
            }
            setAnimating(false);
        });
    }

    if (loading || childOptions?.length === 0) {
        return <div>loading...</div>;
    }

    return (
        <>
            <label htmlFor="children">Child</label>
            <Select
                name="children"
                inputId="children"
                setValue={setChild}
                options={childOptions}
            />
            <label htmlFor="tasks">Task</label>
            <Select
                name="tasks"
                inputId="tasks"
                setValue={setTask}
                options={childOptions}
            />

            <label htmlFor="due_on">Due On:</label>

            <button onClick={createChore}>Create Chore</button>
        </>
    );
}

export default ChoreEditor;