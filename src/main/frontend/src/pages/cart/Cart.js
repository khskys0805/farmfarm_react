import styles from "./Cart.module.css";
import Header from "../../component/Header";
import React, {useEffect, useState} from "react";
import axios from "axios";
import API from "../../config";
import img from "../../images/logo/farmfarm_logo.png";
import {Link, useNavigate} from "react-router-dom";
import {FaTrashAlt} from "react-icons/fa";
import Button from "../../component/Button";
import TabBar from "../../component/TabBar";
import noImage from "../../images/noImage.png";

const Cart = () => {
    const [carts, setCarts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = () => {
        axios.get(API.CART, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            credentials:'include',
        })
            .then((res) => {
                console.log("전송 성공");
                console.log(res.data.result.itemList);
                setCarts(res.data.result.itemList);
            })
            .catch((error) => {
                console.error('장바구니 리스트를 가져오는 중 오류 발생: ', error);
            });
    };

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        if (!isNaN(newQuantity)) {
            setQuantity(Math.min(Math.max(newQuantity, 0), 100));
        }
    }
    const decreaseValue = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 0));
    }

    const increaseValue = () => {
        setQuantity(prevQuantity => Math.min(prevQuantity + 1, 100));
    }

    const handleRemoveItem = (product) => {
        console.log(product.pid);
        if (window.confirm("장바구니에서 상품을 삭제하시겠습니까?")) {
            axios.delete(API.CARTREMOVE(product.pid), {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
            })
                .then((res) => {
                    console.log("상품 삭제 성공");
                    fetchCartItems(); // 장바구니 리스트를 다시 가져옴
                })
                .catch((error) => {
                    console.error('작성한 게시물을 가져오는 중 오류 발생: ', error);
                });
        }
    }

    const handleOrderItem = () => {
        axios.get(API.ORDERCART, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        })
            .then((res) => {
                console.log("전송 성공");
                console.log(res.data.result.isDirect);
                navigate(`/shippingAddress`, { state: { isDirect:res.data.result.isDirect } });
            })
            .catch((error) => {
                console.error('작성한 게시물을 가져오는 중 오류 발생: ', error);
            });
    }
    return (
        <div className={styles.box}>
            <Header title={"장바구니"} go={-1}/>
            <ul>
                {carts.length === 0 ? (
                    <div className={styles.no_list}>
                        <p>아직 장바구니에 담긴 상품이 없습니다!<br/>
                            상품을 구매해보세요!!</p>
                        <Link to="/productList">
                            <div>판매 상품 보러 가기</div>
                        </Link>
                    </div>
                ) : (
                    carts.map((cart, index) => (
                        <>
                            <li key={index} className={styles.cart_list}>
                                <div className={styles.left}>
                                    <div className={styles.img}>
                                        {cart.images.length > 0 && cart.images[0].fileUrl ? (
                                            <img src={cart.images[0].fileUrl} alt="상품 이미지" />
                                        ) : (
                                            <img src={noImage} alt="이미지 없음"/>
                                        )}
                                    </div>
                                    <div>
                                        <p className={styles.farm_name}>{cart.farmName}</p>
                                        <h5 className={styles.product_name}>{cart.productName}</h5>
                                        <h4 className={styles.price}>{cart.price}원</h4>
                                        <h4 className={styles.total_price}>총 금액: {cart.totalPrice}원</h4>
                                    </div>
                                </div>
                                <div className={styles.right}>
                                    <h4 className={styles.remove} onClick={() => handleRemoveItem(cart)}><FaTrashAlt /></h4>
                                    <h4 className={styles.quantity}>
                                        <div className={styles.stepper}>
                                            <div className={styles.stepper_button_minus} onClick={decreaseValue}></div>
                                            <div className={styles.stepper_input_wrap}>
                                                <input type="number" value={cart.quantity} onChange={handleQuantityChange} readOnly/>
                                            </div>
                                            <div className={styles.stepper_button_plus} onClick={increaseValue}></div>
                                        </div>
                                    </h4>
                                </div>
                            </li>
                            <Button content={"주문하기"} onClick={handleOrderItem}/>
                        </>
                    ))
                )}
            </ul>
            <TabBar />
        </div>
    )
}
export default Cart;