import React from "react";
import { MDBContainer, MDBTypography } from "mdb-react-ui-kit";
import Sources from "./card";
import { useSelector } from "react-redux";

export default function Subcon({ activeIndex, setActiveIndex }) {
  const { contract } = useSelector(({ sales }) => sales);

  return (
    <MDBContainer>
      {contract.length > 0 ? (
        contract.map((sale, index) => (
          <Sources
            sale={sale}
            index={index + 1}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        ))
      ) : (
        <MDBTypography note noteColor="info">
          <strong>No Tracking ID: </strong> Walang nagpapa-alalay pa.
        </MDBTypography>
      )}
    </MDBContainer>
  );
}
