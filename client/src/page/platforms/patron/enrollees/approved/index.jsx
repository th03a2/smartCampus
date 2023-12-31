import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import Pager from "../../../../../components/pager";
import BreadCrumb from "../../../../../components/breadcrumb";
import { BROWSE } from "../../../../../redux/slices/query";
import { TBLpending } from "../../../../../templates";
import Modal from "../pending/modal";

const path = [
  {
    path: "Enrolled",
  },
];

export default function Approved() {
  const { token, maxPage, theme, onDuty } = useSelector(({ auth }) => auth),
    { catalogs } = useSelector(({ query }) => query),
    [visibility, setVisibility] = useState(false),
    [enrollees, setEnrollees] = useState([]),
    [information, setInformation] = useState({}),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    dispatch = useDispatch();
  useEffect(() => {
    if (onDuty._id) {
      dispatch(
        BROWSE({
          entity: "assets/enrollment",
          data: { status: "approved", branchId: onDuty._id },
          token,
        })
      );
    }
  }, [dispatch, token, onDuty._id]);

  useEffect(() => {
    setEnrollees(catalogs);
  }, [catalogs]);

  useEffect(() => {
    if (enrollees.length > 0) {
      let totalPages = Math.floor(enrollees.length / maxPage);
      if (enrollees.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      page > totalPages && setPage(totalPages);
    }
  }, [enrollees, page, maxPage]);

  return (
    <>
      <BreadCrumb
        title="Enrolled"
        button={false}
        handler={setVisibility}
        visibility={visibility}
        paths={path}
      />
      <MDBContainer className="py-5 mt-5">
        <MDBRow className="mb-3">
          <MDBCol md={6}>
            <MDBInput
              // onChange={e => handleSearch(e.target.value)}
              type="search"
              label="Search by Grade level"
              contrast={theme.dark}
            />
          </MDBCol>
          <Pager setPage={setPage} total={totalPages} page={page} />
        </MDBRow>
        <TBLpending
          enrollees={enrollees}
          page={page}
          setInformation={setInformation}
          setVisibility={setVisibility}
          status="approved"
        />
        {visibility && (
          <Modal
            visibility={visibility}
            setVisibility={setVisibility}
            information={information}
            status="approved"
          />
        )}
      </MDBContainer>
    </>
  );
}
