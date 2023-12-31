import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBInput,
  MDBIcon,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBTableBody,
  MDBBtnGroup,
  MDBTableHead,
} from "mdb-react-ui-kit";
import { useSelector, useDispatch } from "react-redux";
// import { Statement } from "../../../../../../fakeDb";
import { SAVE, UPDATE } from "../../../../../../redux/slices/query";
import Swal from "sweetalert2";
export default function Modal({
  visibility,
  setVisibility,
  update,
  setIsUpdate,
  isUpdate,
}) {
  const { theme, token } = useSelector(({ auth }) => auth);
  const [form, setForm] = useState({
    name: "",
    acronym: "",
    activity: [],
  });
  const [name, setName] = useState(""),
    [index, setIndex] = useState(-1),
    dispatch = useDispatch();

  useEffect(() => {
    if (isUpdate) {
      setForm(update);
    }
  }, [isUpdate, update]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUpdate) {
      dispatch(
        UPDATE({
          entity: "assets/specializations",
          data: form,
          id: form._id,
          token,
        })
      );
    } else {
      dispatch(
        SAVE({
          entity: "assets/specializations",
          data: form,
          token,
        })
      );
    }
    setVisibility(false);
  };

  const handleClose = () => {
    setVisibility(false);
    setIsUpdate(false);
    setForm({
      name: "",
      acronym: "",
      activity: [],
    });
  };

  const handleMajor = () => {
    if (name) {
      setForm((prevForm) => {
        const newArray = [...prevForm.activity];

        if (index > -1) {
          newArray[index] = name;
        } else {
          newArray.push(name);
        }

        return {
          ...prevForm,
          activity: newArray,
        };
      });
      setName("");
      setIndex(-1);
    } else {
      Swal.fire("Please Input Major!");
    }
  };

  const handleDelete = (index) => {
    setForm((prevForm) => {
      const newArray = [...prevForm.activity];
      newArray.splice(index, 1);

      return {
        ...prevForm,
        activity: newArray,
      };
    });
  };

  const handleUpdate = (index, data) => {
    setName(data);
    setIndex(index);
  };

  return (
    <MDBModal show={visibility} setShow={setVisibility} staticBackdrop>
      <MDBModalDialog size="lg">
        <MDBModalContent className={`${theme.bg} ${theme.text}`}>
          <MDBModalHeader>
            <MDBModalTitle>
              <MDBIcon
                fas
                icon="quidditch"
                style={{ width: "25px" }}
                color="warning"
              />{" "}
              Specializations
            </MDBModalTitle>
            <MDBBtn className="btn-close" color="none" onClick={handleClose} />
          </MDBModalHeader>
          <MDBModalBody className={`${theme.bg} ${theme.text} gui-viewer`}>
            <form onSubmit={handleSubmit}>
              <MDBRow>
                <MDBCol md={6}>
                  <MDBInput
                    type="text"
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </MDBCol>
                <MDBCol md={6}>
                  <MDBInput
                    type="text"
                    label="Acronym"
                    name="acronym"
                    value={form.acronym}
                    onChange={handleChange}
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow className="mt-4">
                <MDBCol md="6">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <MDBInput
                      type="text"
                      label="Activity"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ marginRight: "10px" }}
                    />

                    <MDBBtn type="button" onClick={handleMajor}>
                      {index > -1 ? "Update " : "Add Activity"}
                    </MDBBtn>
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBRow className="mt-4">
                <h6 className="text-center">Activity</h6>
                <MDBCol md={12}>
                  <MDBTable
                    align="middle"
                    hover
                    responsive
                    color={theme.color}
                    className="table table-hover"
                  >
                    <MDBTableHead>
                      <tr>
                        <th>#</th>
                        <th scope="col">Name </th>

                        <th>Action</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {form.activity?.length > 0 ? (
                        form.activity.map((data, index) => (
                          <tr key={`temperature-${index}`}>
                            <td>{1 + index}</td>
                            <td>{data}</td>
                            <td>
                              <MDBBtnGroup>
                                <MDBBtn
                                  color="danger"
                                  type="button"
                                  onClick={() => handleDelete(index)}
                                >
                                  <MDBIcon fas icon="trash" />
                                </MDBBtn>
                                <MDBBtn
                                  color="primary"
                                  type="button"
                                  onClick={() => handleUpdate(index, data)}
                                >
                                  <MDBIcon fas icon="pencil-alt" />
                                </MDBBtn>
                              </MDBBtnGroup>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={3}>No Activity.</td>
                        </tr>
                      )}
                    </MDBTableBody>
                  </MDBTable>
                </MDBCol>
              </MDBRow>
              <MDBContainer className="d-flex justify-content-end mt-4">
                <MDBBtn type="submit">{isUpdate ? "Update" : "Submit"}</MDBBtn>
              </MDBContainer>
            </form>
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
