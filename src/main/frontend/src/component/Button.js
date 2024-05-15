import styles from "./Button.module.css";

const Button = ({ content, color = '#94C015', width, onClick, padding }) => {
    // content가 배열인지 여부를 확인
    const isArrayContent = Array.isArray(content);

    // padding 값을 전달받지 않으면 기본값을 설정
    const paddingValue = padding || (isArrayContent ? '10px 30px' : '20px 30px');

    return (
        <button className={styles.button} onClick={onClick} style={{ background: color, width: width || '100%', padding: paddingValue }}>
            {/* content가 배열이면 각 요소를 순회하면서 출력 */}
            {isArrayContent ? (
                content.map((item, index) => (
                    <div key={index}>{item}</div>
                ))
            ) : (
                /* content가 배열이 아니면 단일 값으로 출력 */
                <div>{content}</div>
            )}
        </button>
    );
}

export default Button;
