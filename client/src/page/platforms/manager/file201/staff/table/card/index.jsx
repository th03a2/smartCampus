import React, { useState } from "react";
import { MDBBtn, MDBBtnGroup } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import MachinesUpdate from "../update";
import { DESTROY } from "../../../../../../../redux/slices/assets/procurements";
import Swal from "sweetalert2";

export default function TableCard({ machine }) {
  const { theme, token } = useSelector(({ auth }) => auth),
    [visibility, setVisibility] = useState(false),
    dispatch = useDispatch();

  const handleToggle = () => setVisibility(!visibility);

  return (
    <tr>
      <td>
        <p className="fw-normal mb-1">
          {machine.name
            ? `${machine.name} / ${machine.brand} / ${machine.model}`
            : `${machine.brand} / ${machine.model}`}
        </p>
      </td>
      <td>
        <p className="text-center fw-normal mb-1">{machine.serialNum}</p>
      </td>
      <td>
        <p className="text-center fw-normal mb-1">
          {machine.mortgage ? `${machine.mortgage} year(s)` : "No mortgage"}{" "}
        </p>
      </td>
      <td>
        <p className="text-center fw-normal mb-1">{machine.price}</p>
      </td>
      <td className="text-center">
        <MDBBtnGroup className="shadow-0">
          <MDBBtn
            onClick={handleToggle}
            color="info"
            size="sm"
            title="Update information."
          >
            update
          </MDBBtn>
          <MDBBtn
            onClick={() =>
              Swal.fire({
                icon: "warning",
                title: "Are you sure?",
                html: `You won't be able to revert this!`,
                showCancelButton: true,
                confirmButtonText: "Yes, continue!",
              }).then(result => {
                if (result.isConfirmed) {
                  dispatch(DESTROY({ id: machine._id, token }));
                }
              })
            }
            color={theme.color}
            size="sm"
            title="Disable Machine."
          >
            archive
          </MDBBtn>
        </MDBBtnGroup>
        <MachinesUpdate
          data={machine}
          visibility={visibility}
          setVisibility={setVisibility}
        />
      </td>
    </tr>
  );
}
