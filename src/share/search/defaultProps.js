/**
 * Created by Lenovo on 2019/9/7.
 */
import search from '../images/search/search.png';
import close from '../images/search/close.png';
function noop() {}
export const defaultProps = {
    prefixCls: 's-search',
    placeholder: '',
    leftClick: noop,
    rightClick: noop,
    searchIcon: search,
    closeIcon:close,
    rightIcon: "",
};