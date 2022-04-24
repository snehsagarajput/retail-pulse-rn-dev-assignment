import firestore from '@react-native-firebase/firestore';
import {captureError} from '../../utils/utils';

const getUserData = (uid) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          reject('No such document!');
        }
      })
      .catch(reject);
  });
};

const getStoresDetail = async (storeIds) => {
  const data = [];
  const promiseArr = [];
  const end =
    storeIds.length % 10 === 0
      ? storeIds.length
      : (parseInt(storeIds.length / 10) + 1) * 10; //runding to next 10's multiple
  for (let i = 0; i < end; i += 10) {
    //batch of 10
    const handlePromise = () =>
      fetchTenDocs(storeIds.slice(i, i + 10), 'stores')
        .then((res) => {
          if (res?.length) {
            data.push(...res);
          }
        })
        .catch(captureError);
    promiseArr.push(handlePromise);
  }
  return Promise.all(promiseArr.map((fn) => fn()))
    .then(() => data)
    .catch(captureError);
};

const fetchTenDocs = (docArray, collection) => {
  return firestore()
    .collection(collection)
    .where('__name__', 'in', docArray)
    .get()
    .then((res) => {
      const data = [];
      res.forEach((doc) => {
        if (doc.exists) {
          const info = doc.data();
          data.push({
            id: doc.id,
            data: Object.assign({}, info, {
              name: info?.name?.substring(3) || '',
            }),
          });
        }
      });
      return data;
    })
    .catch((e) => {
      captureError(e);
      return [];
    });
};

const addToStoreVisitNode = (storeId, uid, updateObj) => {
  firestore()
    .collection('store-visit')
    .doc(storeId)
    .set({[uid]: firestore.FieldValue.arrayUnion(updateObj)}, {merge: true});
};

export {getStoresDetail, getUserData, addToStoreVisitNode};
