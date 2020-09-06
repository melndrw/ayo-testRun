import React, { useState, useEffect } from "react";

import { Row, Col, Input, Card } from "antd";
import { Pagination } from "antd";

import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

import Store from "./Store";
import StoresNav from "./StoresNav";

const { Search } = Input;

const Stores = () => {
  useFirestoreConnect([
    {
      collection: "Stores",
      orderBy: ["createdAt", "desc"],
    },
  ]);

  const [lists, setLists] = useState([]);

  const [search, setSearch] = useState();

  const [pageSize, setPageSize] = useState(3);

  const [activePage, setActivePage] = useState(1);

  const stores = useSelector(state => state.firestore.ordered.Stores);

  useEffect(() => {
    setLists(stores);
  }, [stores]);

  const handleChange = page => {
    setActivePage(page);
  };

  const auth = useSelector(state => state.firebase.auth);

  if (!auth.uid) return <Redirect to="/login" />;

  // Get last index of array by multiplying current page and Number of Items per Page
  const indexOfLast = activePage * pageSize;
  // Get first index of array by subtracting current last index and number of items per page
  const indexOfFirst = indexOfLast - pageSize;
  // Slice state
  const userPerPage = lists && lists.slice(indexOfFirst, indexOfLast);
  // Map the sliced state
  const allStores =
    userPerPage &&
    userPerPage.map((store, idx) => <Store key={idx} store={store} />);

  // Search store
  const searchedStores =
    lists &&
    lists
      .filter(
        list =>
          list.name.toLowerCase().indexOf(search) !== -1 ||
          list.address.toLowerCase().indexOf(search) !== -1
      )
      .map((list, idx) => (
        <Card
          title={list.name}
          size="small"
          style={{ marginTop: "20px", textTransform: "uppercase" }}
          key={idx}
        >
          <p style={{ textTransform: "capitalize" }}>
            Location: {list.address}
          </p>
          <p style={{ textTransform: "capitalize" }}>
            Contact No: {list.contact_no}
          </p>
          <Link
            to={`storedetails/${list.id}`}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "20px",
              textTransform: "capitalize",
            }}
          >
            View...
          </Link>
        </Card>
      ));

  return (
    <>
      <StoresNav />
      <div className="stores">
        <Row gutter={24} justify="space-around">
          <Col span={8}>
            <Search
              placeholder="search by store name or address"
              onSearch={value => setSearch(value)}
              enterButton
            />
            {search && searchedStores}
          </Col>
          <Col span={10}>
            <div style={{ minHeight: "550px" }}>
              {allStores ? allStores : "Loading..."}
              {lists && lists.length === 0 && "No store found..."}
            </div>
            <Pagination
              pageSize={pageSize}
              total={lists && lists.length}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Stores;
