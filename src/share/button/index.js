/**
 * Created by Lenovo on 2019/8/18.
 */
import React from 'react';
import classnames from 'classnames';
import './index.css';
import {defaultProps} from './defaultProps';
import TouchFeedback from 'rmc-feedback';
//两位中文字符的正则
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
//判断是否是两位字符
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
//判断是否是字符类型
function isString(str) {
    return typeof str === 'string';
}
//判断如果是两个中文字符则插入空格
function insertSpace(child) {
    if (isString(child.type) && isTwoCNChar(child.props.children)) {
        return React.cloneElement(
            child,
            {},
            child.props.children.split('').join(' '),
        );
    }
    if (isString(child)) {
        if (isTwoCNChar(child)) {
            child = child.split('').join(' ');
        }
    }
    return child;
}
export default class Button extends React.Component{
    static defaultProps = defaultProps;
    handleClick(){
        const { onClick } = this.props;
        if (onClick) {
            onClick();
        }
    };
    render() {
        const {prefixCls,type,children,className} =this.props;
        //通过classnames方法将所有的class整合
        const wrapCls = classnames(prefixCls, className, {
            [`${prefixCls}-btn`]: (type === 'primary'||!type),
            [`${prefixCls}-btn-fill`]: type === 'fill',
            [`${prefixCls}-btn-half`]: type === 'half',
        });
        //调用insertSpace方法判断如果是两个中文字符则插入空格
        const kids = React.Children.map(children, insertSpace);
        return(
            <TouchFeedback
                activeClassName={prefixCls+"-active"}
            ><div className={wrapCls} onClick={()=>this.handleClick()}>{kids}</div></TouchFeedback>)
    }
}
