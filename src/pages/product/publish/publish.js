import React from 'react';
import {ImagePicker} from 'antd-mobile';
import './publish.css';
import {Select,Title,List,Input,Button,TabBottom} from '../../../share';
import {getData,goNext,checkParam,isDefine} from '../../../utils';
import {Toast} from 'antd-mobile';
export default class Publish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productImgs:[],//初始化商品图片
            typeList:[],//初始化商品类型列表
            productType:'',//初始化商品类型
            productPrice:'',//初始化商品价格
            productDesc:'',//初始化商品描述
            productAddress:"",//初始化商品发货地
        };
        //获取从我发布的商品列表页传过来的参数，并分别赋值。
        this.item = this.props.history.location.state ||{};
        if(this.item.id && this.item.productDesc){
            this.state.productId = this.item.id;
            this.state.productDesc = this.item.productDesc;
            this.state.productPrice = this.item.productPrice;
            this.state.productAddress = this.item.productAddress;
            this.state.productType = this.item.productTypeId;
            this.state.productTypeName = this.item.productTypeName;
            this.state.productImgs = [];
            var list = this.item.productImgs.split(',');
            list.map((item)=>{
                this.state.productImgs.push({url:item});
            })
        }
    }
    componentDidMount(){
        //检查登录状态，如果未登录，getData方法中统一处理未登录进入登录页面
        getData({
            method: 'post',
            url: 'checkLoginValid',
        });
        //获取分类列表信息
        this.getTypeList();
    }
    //首页获取了商品类型列表并缓存下来，这里直接取缓存，如果缓存丢失，重新请求接口
    getTypeList(){
        if(isDefine(localStorage.getItem("typeList"))){
            this.setState({
                typeList:JSON.parse(localStorage.getItem("typeList"))
            })
        }else {
            getData({
                method: 'get',
                url: 'getProductTypeList',
                successCB: (res) => {
                    localStorage.setItem("typeList",JSON.stringify(res.result));
                    let typeList = this.state.typeList.concat(res.result);
                    this.setState({
                        typeList: typeList
                    })
                }
            })
        }
    }
    //发布商品
    submit(flag){
        var arr = [
            {value: (this.state.productDesc.length<9||this.state.productDesc.length>300), msg: "商品描述请输入10-300个字符"},
            {value: this.state.productDesc, msg: "请输入商品描述"},
            {value: this.state.productImgs[0], msg: "请添加图片"},
            {value: this.state.productPrice, msg: "请输入价格"},
            {value: this.state.productAddress, msg: "请输入发货地"},
            {value: this.state.productType, msg: "请选择分类"},
        ];
        //参数非空校验
        checkParam(arr,()=>{
            var token = localStorage.getItem("token");
            var param = new FormData(); //创建form对象
            //之前反显的图片，用于商品更新接口
            var oldImgs = [];
            for (var i = 0; i < this.state.productImgs.length; i++){
                if(!this.state.productImgs[i].file && this.state.productImgs[i].url){
                    oldImgs.push(this.state.productImgs[i].url);
                }
                if(this.state.productImgs[i].file){
                    param.append('productImgs',this.state.productImgs[i].file);//通过append向form对象添加数据
                }
            }
            param.append('productId',this.state.productId);
            param.append('oldImgs',oldImgs);
            param.append('productDesc',this.state.productDesc);
            param.append('productPrice',this.state.productPrice);
            param.append('productAddress',this.state.productAddress);
            param.append('productTypeId',this.state.productType);
            if(flag === 'submit'){
                getData({
                    method: 'post',
                    url: 'publishProduct',
                    headers:{
                        'Content-Type':'multipart/form-data',
                        'token':token
                    },
                    data: param,
                    successCB: () => {
                        //商品发布成功进入首页
                        Toast.success("发布成功");
                        goNext(this,"index");
                    }
                })
            }else {
                param.append('productId',this.state.productId);
                getData({
                    method: 'post',
                    url: 'updateProduct',
                    headers:{
                        'Content-Type':'multipart/form-data',
                        'token':token
                    },
                    data: param,
                    successCB: (res) => {
                        goNext(this,"index");
                    }
                })
            }
        })
    }
    //金额正则校验
    changePrice(val,event){
        event.target.value = event.target.value.replace(/[^\d.]/g,"");
        //清除“数字”和“.”以外的任意字符
        event.target.value = event.target.value.replace(/\.{2,}/g,".");
        //只保留第一个“. ”，清除多余连续的“.”
        event.target.value = event.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        //将第一个“.”用特殊符号替换，其他“.”都转换为空，再将特殊符号用“.”替换回来,目的是为了保证清除掉非连续“.”
        event.target.value = event.target.value.replace(/^(\d+)\.(\d\d).*$/,'$1$2.$3');
        //只能输入两个小数
        if(event.target.value.indexOf(".")< 0 && event.target.value !==""){
            //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            event.target.value= parseFloat(event.target.value);
        }
        //通过 setState 改变金额
        this.setState({
            productPrice:event.target.value
        })
    }
    //更新state
    change(state){
        console.log(state);
        this.setState(state)
    }
    //渲染视图
    render(){
        const { productImgs} = this.state;
        console.log(this.state);
        return(
            <div>
                {this.item.productDesc?<Title  title="编辑商品信息" that={this}/>: <Title isHome={true} title="商品发布"/>}
                <div className="cm-mlr-02 cm-mt-02">
                    <textarea name="" id="" cols="30"
                              onChange={(e)=>this.change({productDesc:e.target.value})}
                              maxLength="300"
                              defaultValue={this.state.productDesc}
                              className="cm-w-full cm-fs-028 cm-border-ddd cm-p-02 publish-textarea" rows="10" placeholder="描述商品转手原因，入手渠道和使用感受"></textarea>
                    <ImagePicker
                        files={productImgs}
                        onChange={(imgs)=>this.change({productImgs:imgs})}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={productImgs.length < 9}
                    />
                <List>
                    <Input
                        label="价格"
                        style = {{textAlign:"right"}}
                        placeholder="请输入价格"
                        defaultValue={this.state.productPrice}
                        onChange={(val,event)=>this.changePrice(val,event)}
                        maxLength={10}
                    />
                </List>
                    <List>
                        <Input
                            label="发货地"
                            style = {{textAlign:"right"}}
                            placeholder="请输入发货地,如:湖北省武汉市"
                            defaultValue={this.state.productAddress}
                            onChange={(val)=>this.change({productAddress:val})}
                            maxLength={10}
                        />
                    </List>
                <List>
                    <Select
                         options={this.state.typeList}
                         babel="分类"
                         activeOne={{type:this.state.productType,name:this.state.productTypeName}}
                         onChange={(item)=>this.change({productType:item.id})}
                    />
                </List>
                </div>
                {this.item.productDesc?<Button className="cm-mt-080" onClick={()=>this.submit('update')}>确认</Button>:
                    <Button  className="cm-mt-04" onClick={()=>this.submit('submit')}>发  布</Button>
                }
                {this.item.productDesc?null:<TabBottom history={this.props.history} activeNum={1}/>}
            </div>
        )
    }
}