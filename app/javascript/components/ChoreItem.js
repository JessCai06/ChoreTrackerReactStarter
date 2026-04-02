import React from "react";
import { useState } from "react";
import FormattedDate from "./FormattedDate";
import StatusButton from "./StatusButton";

function ChoreItem({ chore, choreId }) {
    const [thisChore, setThisChore] = useState(chore.attributes);

    return (
        <React.Fragment>
            <tr key={`chore-${choreId}`}>
                <td>{thisChore.child_name}</td>
                <td>{thisChore.task_name}</td>
                <td>{FormattedDate(thisChore.due_on)}</td>
                <td>
                    <StatusButton choreId={choreId} status={thisChore.status} />
                </td>
            </tr>
        </React.Fragment>
    );
}
export default ChoreItem;