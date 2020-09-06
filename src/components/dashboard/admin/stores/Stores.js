import React, { useState, useEffect } from "react";

import { List, Avatar } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import firebase from "../../../config/firebaseConfig";

const Stores = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    return firebase
      .firestore()
      .collection("Stores")
      .orderBy("createdAt", "desc")
      .limit(4)
      .onSnapshot(snapshot => {
        const newStores = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStores(newStores);
      });
  }, []);

  const data = stores;

  return (
    <>
      <h3>Recently added store</h3>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              // avatar={<Avatar src={storeSvg}/>}
              title={
                <Link
                  to={`storedetails/${item.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {item.name}
                </Link>
              }
              description={`Registered ${moment(
                item.createdAt.toDate()
              ).fromNow()}`}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default Stores;
