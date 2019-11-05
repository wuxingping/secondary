/**
 * Created by Lenovo on 2019/8/4.
 */
import React from 'react';
import publish from '../../../images/product/publish.png';
import {Carousel,ListView} from 'antd-mobile';
import {Search,Type,TabBottom} from '../../../share';
import {getData,goNext} from '../../../utils';
import './index.css';
export default class Index extends React.Component {
    constructor(props){
        super(props);
        this.initData = [];//初始化商品列表，用于上拉加载更多时拼接数据
        this.typeId="";//初始化商品类型id，用于按商品类型查询商品
        this.key="";//初始化关键字，用于按关键字查询商品
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });//初始化商品列表，用于储存商品信息
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            pageNum:1,//初始化查询起始页
            pageSize:10,//初始化查询数量
            typeList:[{name:"全部"}],//初始化产品类型
            hasMore:true,//是否已经加载完列表
            bannerList:[],//初始化轮播图
            statusText:"加载中"//上拉加载展示文本，3种文本【加载中，加载完成，暂无数据】
        }
    }
    //加载页面时获取轮播图列表、商品类型列表、商品列表
    componentDidMount(){
        this.getProductList();
        this.getProductTypeList();
        this.getBannerList();
    }
    //获取商品列表
    getProductList(){
        getData({
            method: 'post',
            url: 'getProductList',
            isShowLoad:true,//是否显示loading图
            data:{
                pageNum:this.state.pageNum,
                pageSize:this.state.pageSize,
                productDesc:this.key,
                productTypeId:this.typeId
            },
            successCB: (res) => {
                this.state.pageNum++;
                this.initData = [...this.initData,...res.result.list];//已有的数组拼接上拉加载更多的数组
                let total = res.result.total;//商品列表总数量
                if(total === 0){
                    this.setState({
                        statusText:"暂无数据"//总数为0时表示没有数据
                    })
                }else if(total === this.initData.length){
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.initData),
                        hasMore:false,//加载完成 hasMore 状态改为false
                        statusText:"加载完成"//拼接的数组长度等于总数时表示加载完成
                    })
                }else {
                    setTimeout(()=>{
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.initData),
                        });
                    },600)
                }
            }
        })
    }
    //获取轮播图列表
    getBannerList(){
        getData({
            method: 'get',
            url: 'getBannerList',
            successCB: (res) => {
                this.setState({
                    bannerList: res.result
                })
            }
        })
    }
    //获取商品类型列表
    getProductTypeList(){
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
    //按商品类型查询商品
    changeType(item){
        this.refs.search.closeValue();
        this.typeId = item.id;
        this.state.pageNum = 1;
        this.key = "";
        this.initData = [];
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            hasMore:true,
            statusText:"加载中"
        });
        this.getProductList();
    }
    //点击某一商品进入商品详情
    goDetail(item){
        goNext(this,"productDetail",item);
    }
    //点击进入发布页面
    goPublish(){
        goNext(this,"publish");
    }
    //通过商品关键字搜索
    getProductListByKey(val){
        this.state.pageNum = 1;
        this.initData = [];
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.initData),
            hasMore:true,
            statusText:"加载中"
        });
        this.key = val;
        this.getProductList()
    }
    //上拉加载更多时触发
    onEndReached = (event) => {
        if (!this.state.hasMore) {
            return false;
        }else {
            this.getProductList();
        }
    };

    //渲染页面
    render() {
        const row = (rowData, sectionID, rowID) => {
            var productImgs = rowData.productImgs.split(",");
            var desc = rowData.productDesc && rowData.productDesc.slice(0,25);
            return (
                    <div  className={rowID%2 === 0?"index-product-left":"index-product-right"} key={rowID} onClick={()=>this.goDetail(rowData)}>
                        <div className="index-img">
                            <img src={productImgs[0]} alt="" className="index-img"/>
                        </div>
                        <div className="cm-p-01">
                        <div className="cm-c-666 cm-mt-01 cm-fs-024">{desc}</div>
                        <div className="index-price cm-c-main cm-fs-026 cm-flex cm-jc-sb">
                            <span>￥{rowData && rowData.productPrice}</span>
                            <span className="cm-c-999 cm-fs-022">{rowData.wantNum>0?rowData.wantNum+"人想要":""}</span>
                        </div>
                        <div className="cm-flex cm-ptb-01 cm-border-top-eee cm-ai-c">
                            <img src={rowData.publishUserAvatar} className="cm-img-04 cm-border-radius-half cm-mr-01" alt=""/>
                            <div className="cm-c-333 cm-fs-026">{rowData.publishUserName}</div>
                        </div>
                        </div>
                    </div>
            );
        };
        return (
            <div>
                <Search
                    onSearch = {(val)=>this.getProductListByKey(val)}
                    rightIcon={publish}
                    onRightClick={()=>this.goPublish()}
                    placeholder="请输入商品关键字"
                    ref="search"
                />
                <div className="cm-img-banner">
                     {this.state.bannerList.length>0?
                         <Carousel style={{height:'4rem'}}>
                              {this.state.bannerList.map((item,index) => {
                                  var productImgs = item.productImgs && item.productImgs.split(",");
                                  return (<img src={productImgs[0]} key={index} alt="" className="cm-img-banner" onClick={()=>this.goDetail(item)}/>)
                              })}
                            </Carousel>:null
                     }
                </div>
                <div className="cm-mlr-02">
                    <Type
                        typeList = {this.state.typeList}
                        onTypeClick = {(val)=>this.changeType(val)}
                    />
                </div>
                <ListView
                        useBodyScroll={true}
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        renderFooter={() => (<div style={{textAlign: 'center' }}>
                            {this.state.statusText}
                        </div>)}
                        renderBodyComponent={() => <Body/>}
                        renderRow={row}
                        pageSize={4}
                        scrollRenderAheadDistance={500}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={10}
                    />
                   <TabBottom history={this.props.history} />
            </div>
        )
    }
}
function Body(props) {
    return(
        <div>
            <div>
                {props.children}
            </div>
        </div>
    )
}