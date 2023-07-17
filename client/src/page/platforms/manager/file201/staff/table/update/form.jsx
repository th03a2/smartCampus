import React from "react";
import { MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";

import { useSelector } from "react-redux";

export default function ModalForm({ data }) {
  const { theme } = useSelector(({ auth }) => auth);

  return (
    <MDBRow>
      <MDBCol md={6}>
        <MDBInput
          type="text"
          icon="thermometer-half"
          label="Name"
          name="name"
          contrast={theme.dark}
          defaultValue={data.name}
        />
      </MDBCol>
      <MDBCol md={6}>
        <MDBInput
          type="text"
          icon="thermometer-half"
          label="Brand"
          name="brand"
          contrast={theme.dark}
          defaultValue={data.brand}
          required
        />
      </MDBCol>
      <MDBCol md={12} className="mt-3">
        <MDBInput
          type="text"
          label="Model"
          name="model"
          contrast={theme.dark}
          defaultValue={data.model}
          required
        />
      </MDBCol>
      <MDBCol md={3} className="mt-3">
        <MDBInput
          type="text"
          label="Depreciation"
          name="depreciation"
          contrast={theme.dark}
          defaultValue={data.depreciation}
        />
      </MDBCol>
      <MDBCol md={3} className="mt-3">
        <MDBInput
          type="number"
          label="Mortgage"
          name="mortgage"
          contrast={theme.dark}
          defaultValue={data.mortgage}
        />
      </MDBCol>
      <MDBCol md={3} className="mt-3">
        <MDBInput
          type="number"
          label="Price"
          name="price"
          contrast={theme.dark}
          defaultValue={data.price}
        />
      </MDBCol>
      <MDBCol md={3} className="mt-3">
        <MDBInput
          type="text"
          label="Serial Number"
          name="serialNum"
          contrast={theme.dark}
          required
          defaultValue={data.serialNum}
        />
      </MDBCol>
      <MDBCol md={12} className="mt-3">
        <MDBInput
          type="text"
          label="Remarks"
          name="remarks"
          contrast={theme.dark}
          defaultValue={data.remarks}
        />
      </MDBCol>
    </MDBRow>
  );
}
