/**
 * Created by Lenovo on 2019/8/10.
 */
import React from 'react';
import {defaultProps} from './defaultProps';
import './index.css';
//视图呈现卡片式布局
export default class Card extends React.Component {
    static defaultProps = defaultProps;
    render(){
        let {onClick,prefixCls} = this.props;
        return(
            <div className={prefixCls} onClick={()=>onClick?onClick():undefined}>
                {this.props.children}
        </div>
        )
    }
}