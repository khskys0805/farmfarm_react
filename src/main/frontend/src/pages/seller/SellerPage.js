import styles from "./SellerPage.module.css";
import {useEffect, useState} from "react";
import { IoIosClose } from "react-icons/io";
import Button from "../../component/Button";
import axios from "axios";
import API from "../../config";

const SellerPage = () => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState({
        deliveryAddress: "",
        deliveryAddressDetail: "",
        deliveryMemo: ""
    });
    const [selectedRows, setSelectedRows] = useState([]);
    const [shippingList, setShippingList] = useState([]);

    useEffect(() => {
        axios.get(API.SHIPPINGLIST, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
        })
            .then((res) => {
                console.log(res.data.result);
                const updatedShippingList = res.data.result.map(item => ({
                    ...item,
                    isEditing: false,
                    shippingStatus: item.isDelivery === true ? "입금확인" : "X"
                }));
                setShippingList(updatedShippingList);
            })
            .catch((error) => {
                console.error('작성한 게시물을 가져오는 중 오류 발생: ', error);
            });
    }, [])

    const toggleEditTrackingNumber = (index) => {
        const updatedData = [...shippingList];
        updatedData[index].isEditing = !updatedData[index].isEditing;
        setShippingList(updatedData);
    };

    const updateTrackingNumber = (index, invoiceNumber) => {
        const updatedData = [...shippingList];
        updatedData[index].invoiceNumber = invoiceNumber;
        setShippingList(updatedData);
    };

    const saveTrackingNumber = (index) => {
        const updatedData = [...shippingList];
        if (updatedData[index].invoiceNumber) {
            updatedData[index].shippingStatus = "배송준비";
        }
        updatedData[index].isEditing = false;
        setShippingList(updatedData);
    }

    const showPopup = (address, detail, memo) => {
        setSelectedAddress({
            deliveryAddress: address,
            deliveryAddressDetail: detail,
            deliveryMemo: memo
        });
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const handleCheckboxChange = (index) => {
        const updatedRows = [...selectedRows];
        if (updatedRows.includes(index)) {
            updatedRows.splice(updatedRows.indexOf(index), 1);
        } else {
            updatedRows.push(index);
        }
        setSelectedRows(updatedRows);

    }

    const handleBatchUpdate = (status) => {
        const updatedData = shippingList.map((item, index) => {
            if (selectedRows.includes(index) && item.invoiceNumber) {
                return {...item, shippingStatus: status};
            }
            return item;
        });
        setShippingList(updatedData);
        setSelectedRows([]);
    }

    return (
        <div>
            <div className={styles.button}>
                <Button content={"배송중 처리"} width={"10%"} onClick={() => handleBatchUpdate("배송중")}/>
                <Button content={"배송완료 처리"} width={"10%"} onClick={() => handleBatchUpdate("배송완료")}/>
            </div>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>선택</th>
                    <th>주문 번호</th>
                    <th>상품명</th>
                    <th>구매자 이름</th>
                    <th>전화번호</th>
                    <th>상품 수량</th>
                    <th>금액</th>
                    <th>거래 방법</th>
                    <th>결제 상태</th>
                    <th>송장번호</th>
                    <th>배송정보</th>
                    <th>배송상태</th>
                </tr>
                </thead>
                <tbody>
                {shippingList.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedRows.includes(index)}
                                onChange={() => handleCheckboxChange(index)}
                            />
                        </td>
                        <td>{item.orderNumber}</td>
                        <td>{item.itemName}</td>
                        <td>{item.deliveryName}</td>
                        <td>{item.deliveryPhone}</td>
                        <td>{item.totalQuantity}</td>
                        <td>{item.totalPrice}원</td>
                        <td>{item.isDelivery ? "배송" : "직거래"}</td>
                        <td>{item.paymentStatus === "PAYMENT_COMPLETED" ? "결제완료" : "결제대기"}</td>
                        <td>
                            {item.isEditing ? (
                                <>
                                    <input
                                        type="number"
                                        value={item.invoiceNumber}
                                        onChange={(e) => updateTrackingNumber(index, e.target.value)}
                                        placeholder="송장번호 입력"
                                        className={styles.trackingNumber}
                                    />
                                    <button onClick={() => saveTrackingNumber(index)} style={{marginLeft:"7px"}}>
                                        저장
                                    </button>
                                </>
                            ) : (
                                <>
                                    {item.invoiceNumber}
                                    {item.invoiceNumber ? (
                                        <button onClick={() => toggleEditTrackingNumber(index)}  style={{marginLeft:"7px"}}>
                                            수정
                                        </button>
                                    ) : (
                                        <button onClick={() => toggleEditTrackingNumber(index)}>
                                            입력
                                        </button>
                                    )}

                                </>
                            )}
                        </td>
                        <td>
                            <button onClick={() => showPopup(item.deliveryAddress, item.deliveryAddressDetail, item.deliveryMemo)}>보기</button>
                        </td>
                        <td>
                            {item.shippingStatus}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* 팝업 */}
            {popupVisible && (
                <div className={styles.popup}>
                    <h4>거주지: <span>{selectedAddress.deliveryAddress}</span></h4>
                    <h4><span>{selectedAddress.deliveryAddressDetail}</span></h4>
                    <h4 style={{marginTop:"20px"}}>배송 메모: <span>{selectedAddress.deliveryMemo}</span></h4>
                    <div className={styles.close_popup}><IoIosClose onClick={closePopup} size="25"/></div>
                </div>
            )}
            {/* 팝업 배경 (클릭 시 팝업 닫기) */}
            {popupVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 999
                    }}
                    onClick={closePopup}
                >
                </div>
            )}
        </div>
    );
}

export default SellerPage;
