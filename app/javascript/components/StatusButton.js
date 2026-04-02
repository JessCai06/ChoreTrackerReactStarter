import React from "react";
import { useState } from "react";
import { put } from "../api";

function StatusButton({ choreId, status }) {
    const [thisStatus, setThisStatus] = useState(status);

    function toggleStatus() {
        put(`/v1/chores/${choreId}/toggle_status`).then((response) => {
            const newStatus = thisStatus === "Pending" ? "Completed" : "Pending";
            setThisStatus(newStatus);
        });
    }

    return <button onClick={toggleStatus}>{thisStatus}</button>;
}
export default StatusButton;