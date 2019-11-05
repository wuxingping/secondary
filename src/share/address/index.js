/**
 * Created by Lenovo on 2019/10/15.
 */
import React from 'react';
import {defaultProps} from './defaultProps';
import './index.css';
import close from '../images/address/close-gray.png';
import checked from '../images/address/checked.png';
import {addressInfo} from './addressInfo';
export default class Address extends React.Component {
    static defaultProps = defaultProps;
    constructor(props){
        super(props);
        this.selectList = [];
        this.addressList = [];
        this.generate(addressInfo,this.addressList,"0");
        this.state={
            defaultText:"选择省份/城市",
            province:"",
            selectOne:"",
            city:"选择城市",
            district:"选择区县",
            street:"选择街道",
            selectList:[],
            hotCity:[
                {name:"武汉市",id:"11",superId:"1",type:"city"},
                {name:"孝感市",id:"12",superId:"1",type:"city"},
                {name:"荆门市",id:"13",superId:"1",type:"city"},
                {name:"十堰市",id:"14",superId:"1",type:"city"},
                {name:"黄冈市",id:"15",superId:"1",type:"city"},
                {name:"天门市",id:"16",superId:"1",type:"city"},

                {name:"常德市",id:"17",superId:"2",type:"city"},
                {name:"长沙市",id:"18",superId:"2",type:"city"},
                {name:"郴州市",id:"19",superId:"2",type:"city"},
                {name:"衡阳市",id:"20",superId:"2",type:"city"},
                {name:"怀化市",id:"21",superId:"2",type:"city"},
                {name:"娄底市",id:"22",superId:"2",type:"city"},
            ],
            isChoose:false,
            addressList:this.addressList
        }
    }
    //处理数据结构，将数组处理成链表形式
    generate = (list,arr,superId)=>{
        var data = arr||[];
        for(var i =0;i<list.length;i++){
            var item = list[i];
            if(item.superId == superId){
                if(item.type == "province"){
                    item.text = "选择城市";
                }
                if(item.type == "city"){
                    item.text = "选择县区";
                }
                if(item.type == "district"){
                    item.text = "选择街道";
                }
                data.push(item);
                data.map((item1)=>{
                    item1.list = [];
                    return this.generate(list,item1.list,item1.id);
                })
            }
        }
        return data;
    };
    //选择热门城市
    chooseCity(text){
        var province = {};
        var item = {};
        for(var i=0;i<this.addressList.length;i++){
            var itemOne = this.addressList[i];
            //同等类型（都是省份或者都是城市）添加后替换掉原先的地区，清除掉后面的选项。
            for(var j=0;j<itemOne.list.length;j++){
                var itemOne1 = itemOne.list[j];
                if(itemOne1.type == text.type && itemOne1.name.indexOf(text.name)>-1){
                    province = itemOne;
                    item = itemOne1;
                    break;
                }
            }
        }
        this.selectList.push(province);
        this.selectList.push(item);
        this.selectList.push({name:item.text,list:item.list});
        this.setState({
            selectOne:{name:item.text,list:item.list},
            isChoose:true,
            addressList:item.list,
            defaultText:item.text,
            selectList:this.selectList,
        })
    }
    //改变地址
    changeAddress(item){
        this.setState({
            selectOne:item
        });
        //找到对应的数据集
        this.findOne(this.addressList,item)
    }
    findOne(list,item){
        if(list && list.length){
            for(var i=0;i<list.length;i++){
                var item1 = list[i];
                if(item.name.indexOf("选择")>-1){
                    this.setState({
                        addressList:item.list
                    });
                    break;
                }else if(item.name == item1.name){
                    this.setState({
                        addressList:list
                    });
                    break;
                }else {
                    this.findOne(item1.list,item)
                }
            }
        }
    }
    //选择地区
    chooseAddress(item){
        let {getAddress} = this.props;
        for(var i=0;i<this.selectList.length;i++){
                var itemOne = this.selectList[i];
                //将选择列表表带有选择的去掉。
                if(itemOne.name.indexOf("选择")>-1){
                    this.selectList.splice(i,1);
                    break;
                }
                //同等类型（都是省份或者都是城市）添加后替换掉原先的地区，清除掉后面的选项。
                if(itemOne.type == item.type){
                    this.selectList[i] = item;
                    this.selectList = this.selectList.slice(0,i+1);
                    this.selectList.push({name:item.text,list:item.list});
                    break;
                }
        }
        //去重，只添加没有添加的地址
        if(!this.selectList.includes(item)){
            this.selectList.push(item);
            this.selectList.push({name:item.text,list:item.list});
        }
        this.setState({
            selectOne:{name:item.text,list:item.list},
            isChoose:true,
            addressList:item.list,
            defaultText:item.text,
            selectList:this.selectList,
        },()=>{
            if(item.list.length == 0){
                //过滤掉带有选择的值
                this.state.selectList = this.state.selectList.filter((item)=>item.name && item.name.indexOf("选择")<0);
                var obj = {};
                obj.province = this.state.selectList[0]?this.state.selectList[0].name:"";
                obj.city = this.state.selectList[1]?this.state.selectList[1].name:"";
                obj.district = this.state.selectList[2]?this.state.selectList[2].name:"";
                obj.street = this.state.selectList[3]?this.state.selectList[3].name:"";
                getAddress(obj);
            }
        })
    }
    render(){
        let {closeModel,prefixCls} = this.props;
        return(
            <div className={prefixCls}>
                <div className={prefixCls+"-wrapper"}>
                <div className={prefixCls+"-title"}>
                    <div className={prefixCls+"-title-left"}></div>
                    <div className={prefixCls+"-title-text"}>请选择</div>
                    <img src={close} alt="" className={prefixCls+"-title-right"} onClick={()=>closeModel()}/>
                </div>
                    {this.state.isChoose?
                        <div className={prefixCls+"-already"}>
                            {this.state.selectList.map((item,index)=>{
                            return <div key={index}
                                       className={item.name == this.state.selectOne.name?prefixCls+"-already-item-active":prefixCls+"-already-item"}
                                       onClick={()=>this.changeAddress(item)}
                            >{item.name}</div>
                        })}
                        </div>:
                        <div className={prefixCls+"-city"}>
                            <div className={prefixCls+"-city-text"}>热门城市</div>
                            <div className={prefixCls+"-city-list"}>
                                {
                                    this.state.hotCity.map((item,index)=>{
                                        return <div key={index} className={prefixCls+"-city-item"} onClick={()=>this.chooseCity(item)}>{item.name}</div>
                                    })
                                }
                            </div>
                        </div>
                    }
                    <div className={prefixCls+"-select"}>
                            <div className={prefixCls+"-select-text"}>{this.state.defaultText}</div>
                            <div className={prefixCls+"-select-list"}>
                                {
                                    this.state.addressList.map((item,index)=>{
                                        return <div className={prefixCls+"-select-wrapper"} key={index}>
                                        <div onClick={()=>this.chooseAddress(item,index)}
                                             className={item.name == this.state.selectOne.name?prefixCls+"-select-item-active":prefixCls+"-select-item"}>{item.name}</div>
                                            {item.name == this.state.selectOne.name? <img src={checked} alt="" className={prefixCls+"-select-item-checked"}/>:null}
                                        </div>
                                    })
                                }
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}