import React, { useState } from "react"
import PropTypes from "prop-types"
import { get } from "../api"
import FormattedDate from "./FormattedDate"
import ChoreItem from "./ChoreItem"
import ChoreEditor from "./ChoreEditor";

const Chores = (props) => {
  const [chores, setChores] = React.useState([]);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    get("/v1/chores").then((response) => {
      setChores(response.data);
    });
  }, []);

  function addChoreToDisplay(chore) {
    setChores((prevChores) => [...prevChores, chore.data]);
  }

  return (
    <React.Fragment>
      <div>
        <table>
          <thead>
            <tr>
              <th width="125" align="left">
                Child
              </th>
              <th width="200" align="left">
                Task
              </th>
              <th width="75">Due on</th>
              <th width="75">Status</th>
            </tr>
          </thead>
          <tbody>
            {chores.map((chore) => (
              <ChoreItem key={`chore-${chore.id}`} chore={chore} choreId={chore.id} />
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => setIsEditing(true)}>Create New Chore</button>
      <br />
      {isEditing && (
        <>
          <ChoreEditor
            onCreateChore={(chore) => {
              addChoreToDisplay(chore);
              setIsEditing(false);
            }}
          />&nbsp;&nbsp;
          <a onClick={() => setIsEditing(false)}>Cancel</a>
        </>
      )}

    </React.Fragment>
  )
}


export default Chores
