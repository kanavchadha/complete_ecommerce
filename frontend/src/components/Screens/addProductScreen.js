import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { productList, saveProduct, deleteProdcut } from '../../actions/productActions';
import { listOrders } from '../../actions/orderActions';
import axios from 'axios';
import { Popconfirm,message } from 'antd';
import Dropzone from 'react-dropzone';

const ProductsScreen = (props) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  const { userInfo } = useSelector(state => state.userSignin);
  const { products, loading, error } = useSelector(state => state.productList);
  const productSave = useSelector(state => state.productSave);
  const { loading: loadingSave, success: successSave, error: errorSave } = productSave;
  const productDelete = useSelector((state) => state.productDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete, } = productDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
    }

    dispatch(productList());
  }, [successSave, successDelete])

  const openModal = (product) => {
    setModalVisible(true);
    setId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
    setBrand(product.brand);
    setCategory(product.category);
    setCountInStock(product.countInStock);
  }
  const uploadImageURL = (value) => {
    const images = value.split(',');
    setImage(images);
  }
  const uploadFileHandler = (files) => {
    let formData = new FormData();
    formData.append("file", files[0]);
    axios.post('/api/products/uploadImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + userInfo.token
      },
    }).then((response) => {
      if (response.data.success) {
        setImage([...image, 'http://localhost:5000/' + response.data.image])
      
        message.success('Image has been uploaded successfully!');
        props.refreshFunction([...image, response.data.image])
      } else {
        message.error('Image upload failed!');
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  const deleteHandler = (product) => {
    dispatch(deleteProdcut(product._id));
    message.success('Product Deleted successfully!');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveProduct({ _id: id, name, price, image, brand, category, description, countInStock }));
    message.success('Product has created successfully!');
  }

  const adminOrders = () => {
    dispatch(listOrders());
    props.history.push('/orders');
  }

  function cancel(e) {
    message.error('Click on No');
  }

  return (
    <div className="content content-margined">
      <div className="product-header">
        <h2>Products</h2>
        <div>
          <button className="button createProd" onClick={() => openModal({ image: [] })}>
            Create Product
          </button>
          <button className="button createProd" onClick={adminOrders}>
            Orders
          </button>
        </div>
      </div>
      { modalVisible && (
        <div className="form">
          <form onSubmit={submitHandler}>
            <ul className="form-container" style={{ width: '46rem' }}>
              <li>
                <h2>Create Product</h2>
              </li>
              <li>
                {loadingSave && <div>Loading...</div>}
                {errorSave && <div>{errorSave}</div>}
              </li>

              <li>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  name="price"
                  value={price}
                  id="price"
                  onChange={(e) => setPrice(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor="image">Image</label>
                <input
                  type="text"
                  name="image"
                  value={image}
                  id="image"
                  onChange={(e) => uploadImageURL(e.target.value)}
                ></input> -- or --
				<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center' }}>
                  <Dropzone
                    onDrop={uploadFileHandler}
                    multiple={false}
                    maxSize={8000000}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div style={{
                        width: '75px', height: '60px', border: '1px solid lightgray',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }} {...getRootProps()} >
                        <input {...getInputProps()} />
                        <i className="fa fa-plus" style={{ fontSize: '2.5rem' }} />
                      </div>
                    )}
                  </Dropzone>
                  <div style={{ display: 'flex', width: '150px', height: '86px', overflowX: 'scroll', overflowY: 'hidden' }}>
                    {image.map((pic, index) => (
                      <div><img style={{ width: '150px', height: '86px' }} src={pic} alt={`productImg-${index}`} /> </div>
                    ))}
                  </div>
                </div>
              </li>
              <li>
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={brand}
                  id="brand"
                  onChange={(e) => setBrand(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor="countInStock">CountInStock</label>
                <input
                  type="text"
                  name="countInStock"
                  value={countInStock}
                  id="countInStock"
                  onChange={(e) => setCountInStock(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor="name">Category</label>
                <input
                  type="text"
                  name="category"
                  value={category}
                  id="category"
                  onChange={(e) => setCategory(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={description}
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}></textarea>
              </li>
              <li>
                <button type="submit" className="button primary">
                  {id ? 'Update' : 'Create'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setModalVisible(false)} className="button secondary">
                  Back
                    </button>
              </li>
            </ul>
          </form>
        </div>
      )}

      <div className="product-list">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Action</th>
            </tr>
          </thead>
          {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <button className="button edit" onClick={() => openModal(product)}>
                      Edit
                    </button>
                    <Popconfirm
                      title="Are you sure delete this Product?"
                      onConfirm={() => deleteHandler(product)}
                      onCancel={cancel}
                      okText="Delete"
                      cancelText="Cancel">
                      <button className="button delete">
                        Delete
                      </button>
                  </Popconfirm>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default ProductsScreen;