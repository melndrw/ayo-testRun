import { storage } from '../../config/firebaseConfig';

var config = {
  apiKey: 'AIzaSyDFr2Qsnag57QhFzWfbPh9w-VmKqdN1DF0',
  authDomain: 'ayoph-bbceb.firebaseapp.com',
  databaseURL: 'https://ayoph-bbceb.firebaseio.com',
};

export const addStore = (
  { firebase, firestore },
  newStore,
  uploaded,
  openAndClose,
  statusCallback
) => {
  const { lat, lng } = newStore;
  var secondaryApp = firebase.initializeApp(config, 'Secondary');
  console.log(openAndClose);
  return (dispatch, getState) => {
    secondaryApp
      .auth()
      .createUserWithEmailAndPassword(newStore.email, newStore.password)
      .then((res) => {
        var actionCodeSettings = {
          url: 'https://ayoph-bbceb.web.app/',
          handleCodeInApp: false,
        };
        secondaryApp
          .auth()
          .currentUser.sendEmailVerification(actionCodeSettings)
          .then(function () {
            // Verification email sent.
            console.log('email verification sent!');
          })
          .catch(function (error) {
            // Error occurred. Inspect error.code.
            console.log(error.message);
          });
        secondaryApp.auth().signOut();
        secondaryApp.delete();

        statusCallback('Store successfully registered');
        firestore.collection('Accounts').doc(res.user.uid).set({
          firstName: newStore.firstName,
          lastName: newStore.lastName,
          role: 'owner', // change role if needed rider/owner/admin
          createdAt: new Date(),
        });

        if (uploaded) {
          const uploadImg = storage
            .ref(`images/${uploaded.name}`)
            .put(uploaded);
          uploadImg.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
              console.log(error);
            },
            () => {
              storage
                .ref('images')
                .child(uploaded.name)
                .getDownloadURL()
                .then((url) => {
                  firestore
                    .collection('Stores')
                    .doc(res.user.uid)
                    .set({
                      name: newStore.name,
                      owner: newStore.firstName + ' ' + newStore.lastName,
                      landmark: newStore.landmark,
                      address: newStore.address,
                      contact_no: newStore.contactNo,
                      coordinates: new firebase.firestore.GeoPoint(lat, lng),
                      geohash: newStore.ghash,
                      createdAt: new Date(),
                      coverPhoto: {
                        fileName: uploaded.name,
                        uid: uploaded.uid,
                        url: url,
                      },
                      OpeningandClosing: [openAndClose],
                    });

                  console.log('success w/ image');
                });
              statusCallback('success');
            }
          );
        }
      })
      .then(() => {
        secondaryApp.auth().signOut();
        secondaryApp.delete();
        dispatch({
          type: 'ADD_STORE',
        });
      })
      .catch((err) => {
        secondaryApp.auth().signOut();
        secondaryApp.delete();
        dispatch({
          type: 'ADD_STORE_FAIL',
          err,
        });
        setTimeout(() => statusCallback(err.message), 10000);
      });
  };
};

export const addProduct = (
  { firebase, firestore },
  productDetail,
  prodId,
  imgFile,
  statusCallback
) => {
  return (dispatch, getState) => {
    // check if there is an img
    if (imgFile) {
      const uploadImg = storage.ref(`images/${imgFile.name}`).put(imgFile);
      uploadImg.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref('images')
            .child(imgFile.name)
            .getDownloadURL()
            .then((url) => {
              let newObj = { ...productDetail, url };
              firestore
                .collection('Stores')
                .doc(prodId)
                .set(
                  {
                    products: firebase.firestore.FieldValue.arrayUnion(newObj),
                  },
                  { merge: true }
                );

              console.log('success w/ image');
            });
          statusCallback('success');
        }
      );
    }
    // no img
    else {
      statusCallback('success');
      let url = 'no url';
      let newObj = { ...productDetail, url };
      firestore
        .collection('Stores')
        .doc(prodId)
        .set(
          {
            products: firebase.firestore.FieldValue.arrayUnion(newObj),
          },
          { merge: true }
        );
      console.log('success w/o image');
    }
  };
};

// Add product by owner
export const addProductByOwner = (
  { firebase, firestore },
  storeId,
  productDetail,
  imgFile,
  statusCallback
) => {
  return (dispatch, getState) => {
    // check if there is an img

    if (imgFile) {
      const uploadImg = storage.ref(`images/${imgFile.name}`).put(imgFile);
      uploadImg.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref('images')
            .child(imgFile.name)
            .getDownloadURL()
            .then((url) => {
              let newObj = { ...productDetail, url };
              firestore
                .collection('Stores')
                .doc(storeId)
                .set(
                  {
                    products: firebase.firestore.FieldValue.arrayUnion(newObj),
                  },
                  { merge: true }
                );

              console.log('success w/ image');
            });
          statusCallback('success');
        }
      );
    }
    // no img
    else {
      statusCallback('success');
      let url = 'no url';
      let newObj = { ...productDetail, url };
      firestore
        .collection('Stores')
        .doc(storeId)
        .set(
          {
            products: firebase.firestore.FieldValue.arrayUnion(newObj),
          },
          { merge: true }
        );
      console.log('success w/o image');
    }
  };
};

export const editStoreAction = (
  { firestore },
  storeId,
  targetStoreNew,
  openAndClose,
  editUpload,
  statusCallback
) => {
  const { name, landmark, owner, contact_no } = targetStoreNew;
  return (dispatch, getState) => {
    firestore
      .collection('Stores')
      .doc(storeId)
      .update({
        name,
        landmark,
        owner,
        contact_no,
        OpeningandClosing: [openAndClose],
      });

    if (editUpload) {
      const uploadImg = storage
        .ref(`images/${editUpload.name}`)
        .put(editUpload);
      uploadImg.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref('images')
            .child(editUpload.name)
            .getDownloadURL()
            .then((url) => {
              firestore
                .collection('Stores')
                .doc(storeId)
                .set({
                  ...targetStoreNew,
                  coverPhoto: {
                    fileName: editUpload.name,
                    uid: editUpload.uid,
                    url: url,
                  },
                });
            });
        }
      );
    }

    statusCallback('success');
  };
};

export const editProduct = (
  { firebase, firestore },
  productDetail,
  productDetailReplace,
  prodId,
  imgFileEdit,
  statusCallback
) => {
  return (dispatch, getState) => {
    // Del product[n]
    firestore
      .collection('Stores')
      .doc(prodId)
      .update({
        products: firebase.firestore.FieldValue.arrayRemove({
          productName: productDetail.productName,
          price: productDetail.price,
          description: productDetail.description,
          url: productDetail.url,
        }),
      });
    console.log('Updating...');

    // Check if there is an img
    if (imgFileEdit) {
      const uploadImg = storage
        .ref(`images/${imgFileEdit.name}`)
        .put(imgFileEdit);
      uploadImg.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref('images')
            .child(imgFileEdit.name)
            .getDownloadURL()
            .then((url) => {
              let newObj = { ...productDetailReplace, url };
              firestore
                .collection('Stores')
                .doc(prodId)
                .set(
                  {
                    products: firebase.firestore.FieldValue.arrayUnion(newObj),
                  },
                  { merge: true }
                );

              console.log('update success w/ image');
              statusCallback('success');
            });
        }
      );
    }
    // Update w/o  img
    else {
      firestore
        .collection('Stores')
        .doc(prodId)
        .set(
          {
            products: firebase.firestore.FieldValue.arrayUnion(
              productDetailReplace
            ),
          },
          { merge: true }
        );
      console.log('update success w/o image');
      statusCallback('success');
    }
  };
};
