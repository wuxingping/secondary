/**
 * Created by Lenovo on 2019/8/4.
 */
import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import Index from './pages/product/index/index';
import Publish from './pages/product/publish/publish';
import ProductDetail from './pages/product/productDetail/productDetail';
import Personal from './pages/personal/personal';
import MessageList from './pages/message/messageList/messageList';
import Login from './pages/account/login/login';
import Register from './pages/account/register/register';
import MessageDetail from './pages/message/messageDetail/messageDetail';
import MyPublish from './pages/personal/myPublish';
import MySale from './pages/personal/mySale';
import MyPurchase from './pages/personal/myPurchase';
import ModifyPwd from './pages/personal/modifyPwd';
import ModifyInfo from './pages/personal/modifyInfo';
import VerifyOldMobile from './pages/personal/verifyOldMobile';
import BindNewMobile from './pages/personal/bindNewMobile';
import ForgotPwd from './pages/personal/forgotPwd';
import ProductList from './pages/personal/productList';
import AddressManage from './pages/personal/addressManage';
import AddAddress from './pages/personal/addAddress';
import Order from './pages/payment/order';
import OrderDetail from './pages/payment/orderDetail';
const Router = () => (
    <BrowserRouter>
        <Route exact  path="/"   component={Index}/>
        <Route exact  path="/publish"   component={Publish}></Route>
        <Route exact  path="/index"   component={Index}/>
        <Route exact  path="/productDetail"   component={ProductDetail}/>

        <Route exact  path="/message"   component={MessageList}></Route>
        <Route exact  path="/messageDetail"   component={MessageDetail}></Route>


        <Route exact  path="/personal"   component={Personal}/>
        <Route exact  path="/myPublish"   component={MyPublish}></Route>
        <Route exact  path="/mySale"   component={MySale}></Route>
        <Route exact  path="/myPurchase"   component={MyPurchase}></Route>
        <Route exact  path="/modifyInfo"   component={ModifyInfo}></Route>
        <Route exact  path="/productList"   component={ProductList}></Route>
        <Route exact  path="/addressManage"   component={AddressManage}></Route>
        <Route exact  path="/addAddress"   component={AddAddress}></Route>

        <Route exact  path="/order"   component={Order}></Route>
        <Route exact  path="/orderDetail"   component={OrderDetail}></Route>

        <Route exact  path="/login"   component={Login}></Route>
        <Route exact  path="/register"   component={Register}></Route>
        <Route exact  path="/verifyOldMobile"   component={VerifyOldMobile}></Route>
        <Route exact  path="/bindNewMobile"   component={BindNewMobile}></Route>
        <Route exact  path="/forgotPwd"   component={ForgotPwd}></Route>
        <Route exact  path="/modifyPwd"   component={ModifyPwd}></Route>
    </BrowserRouter>
);
export default Router;
