import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../../../redux/slices/commerce/menus";
import Pager from "../../../../../../../components/pager";
import TBLmenu from "./table";

export default function DetailsMenu({
  source,
  handleTransfer,
  branchId,
  usage = "default",
}) {
  const { theme, maxPage, token } = useSelector(({ auth }) => auth),
    { catalogs } = useSelector(({ menus }) => menus),
    [cluster, setCluster] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    dispatch = useDispatch();

  useEffect(() => {
    if (branchId) {
      dispatch(BROWSE({ branchId, token }));
    }
  }, [branchId]);

  useEffect(() => {
    setCluster(catalogs);
  }, [catalogs]);

  //Pagination
  useEffect(() => {
    let totalPages = Math.floor(cluster.length / maxPage);
    if (cluster.length % maxPage > 0) totalPages += 1;
    setTotalPages(totalPages);

    page > totalPages && setPage(totalPages);
  }, [cluster, page]);

  const handleSearch = (keys) => {
    if (keys) {
      setCluster(
        catalogs.filter((service) =>
          Object.values(service).some((val) =>
            String(val).toLowerCase().includes(keys)
          )
        )
      );
    } else {
      setCluster(catalogs);
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className="mb-3">
        <MDBCol md={6}>
          <MDBInput
            onChange={(e) => handleSearch(e.target.value)}
            type="search"
            label="Search by Name"
            contrast={theme.dark}
          />
        </MDBCol>
        <Pager setPage={setPage} total={totalPages} page={page} />
      </MDBRow>
      <TBLmenu
        usage={usage}
        menus={cluster}
        page={page}
        source={source}
        handleTransfer={handleTransfer}
      />
    </MDBContainer>
  );
}
