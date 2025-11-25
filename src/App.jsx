import React, {useState} from "react";

export default function App() {
    const [screen, setScreen] = useState("setup");

    // =======================
    //  SETUP
    // =======================
    const [minNumber, setMinNumber] = useState(0);
    const [maxNumber, setMaxNumber] = useState(9999);
    const [prizes, setPrizes] = useState([
        {order: 1, name: "Giải Nhất", quantity: 1},
        {order: 2, name: "Giải Nhì", quantity: 2},
        {order: 3, name: "Giải Ba", quantity: 3}
    ]);

    const addPrize = () => {
        setPrizes([...prizes, {order: prizes.length + 1, name: "", quantity: 1}]);
    };

    const updatePrize = (index, field, value) => {
        const newData = [...prizes];
        newData[index][field] = value;
        setPrizes(newData);
    };

    const goSpinScreen = () => {
        setScreen("spin");
    };

    // =======================
    //  SPIN SCREEN
    // =======================
    const digitCount = maxNumber.toString().length;
    const [slots, setSlots] = useState(Array(digitCount).fill(""));
    const [spinning, setSpinning] = useState(false);

    const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
    const [results, setResults] = useState({});

    const randomDigit = () => Math.floor(Math.random() * 10);

    const spin = () => {
        if (spinning) return;

        const prize = prizes[currentPrizeIndex];
        if (!prize) return;

        const existingCodes = Object.values(results).flat() || [];
        let finalCode = "";

        do {
            finalCode = Array.from({length: digitCount})
                .map(() => randomDigit())
                .join("");
        } while (existingCodes.includes(finalCode));

        setSpinning(true);

        let temp = [...slots];
        const intervals = temp.map((_, i) =>
            setInterval(() => {
                temp[i] = randomDigit();
                setSlots([...temp]);
            }, 60)
        );

        temp.forEach((_, index) => {
            setTimeout(() => {
                clearInterval(intervals[index]);
                temp[index] = finalCode[index];
                setSlots([...temp]);

                if (index === temp.length - 1) {
                    setSpinning(false);

                    setResults((prev) => ({
                        ...prev,
                        [prize.name]: [...(prev[prize.name] || []), finalCode]
                    }));

                    const count = (results[prize.name]?.length || 0) + 1;

                    if (count >= prize.quantity) {
                        setCurrentPrizeIndex(currentPrizeIndex + 1);
                    }
                }
            }, 800 + index * 200);
        });
    };

    const resetAll = () => {
        setScreen("setup");
        setSlots(Array(digitCount).fill(""));
        setSpinning(false);
        setResults({});
        setCurrentPrizeIndex(0);
    };

    // =======================
    //  STYLE CHUNG (inline)
    // =======================
    const containerStyle = {
        minWidth: "100vw",
        minHeight: "100vh",
        padding: "1px",
        backgroundImage: `url("/bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#880e4f",
        textShadow: "1px 1px 2px white",
        fontFamily: "Arial, sans-serif"
    };

    const cardStyle = {
        background: "rgba(255, 240, 245, 0.9)",
        padding: "20px",
        borderRadius: "16px",
        border: "3px solid #ff8ab1",
        width: "700px",
        margin: "auto",
        marginTop: "450px",
        boxShadow: "0 0 20px rgba(255, 100, 150, 0.4)"
    };

    const buttonPrimary = {
        padding: "12px 25px",
        fontSize: "18px",
        background: "#ff5c8d",
        border: "none",
        borderRadius: "10px",
        color: "white",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(255, 0, 100, 0.4)",
        marginTop: "15px"
    };

    const buttonSecondary = {
        padding: "12px 25px",
        fontSize: "18px",
        background: "#ff9ecb",
        border: "2px solid #ff5c8d",
        borderRadius: "10px",
        cursor: "pointer",
        marginLeft: "15px"
    };

    const inputStyle = {
        padding: "6px 10px",
        fontSize: "16px",
        marginLeft: "5px",
        borderRadius: "6px",
        border: "1px solid #ff8ab1"
    };

    // =======================
    //  MÀN HÌNH SETUP
    // =======================
    if (screen === "setup") {
        return (
            <div style={{width: "100vw",}}>
                <div style={containerStyle}>
                    <div style={cardStyle}>
                        <h1 style={{textAlign: "center", color: "#d81b60"}}>🎀 CẤU HÌNH QUAY SỐ EVENT SHOW 🎀</h1>

                        <h2>1️⃣ Cấu hình số</h2>
                        <div style={{marginBottom: "20px"}}>
                            Min:
                            <input
                                type="number"
                                value={minNumber}
                                onChange={(e) => setMinNumber(e.target.value)}
                                style={inputStyle}
                            />
                            &nbsp;&nbsp; Max:
                            <input
                                type="number"
                                value={maxNumber}
                                onChange={(e) => setMaxNumber(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <h2>2️⃣ Cấu hình giải thưởng</h2>
                        {prizes.map((p, i) => (
                            <div key={i} style={{marginBottom: "12px"}}>
                                Thứ tự:
                                <input
                                    type="number"
                                    value={p.order}
                                    onChange={(e) => updatePrize(i, "order", Number(e.target.value))}
                                    style={{...inputStyle, width: "60px"}}
                                />
                                &nbsp; Tên giải:
                                <input
                                    value={p.name}
                                    onChange={(e) => updatePrize(i, "name", e.target.value)}
                                    style={inputStyle}
                                />
                                &nbsp; Số lượng:
                                <input
                                    type="number"
                                    value={p.quantity}
                                    onChange={(e) => updatePrize(i, "quantity", Number(e.target.value))}
                                    style={{...inputStyle, width: "60px"}}
                                />
                            </div>
                        ))}

                        <button onClick={addPrize} style={buttonSecondary}>➕ Thêm giải</button>

                        <div style={{textAlign: "center"}}>
                            <button onClick={goSpinScreen} style={buttonPrimary}>
                                👉 BẮT ĐẦU QUAY
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

    // =======================
    //  MÀN HÌNH QUAY SỐ
    // =======================
    const currentPrize = prizes[currentPrizeIndex];

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                {/*<h1 style={{ textAlign: "center" }}>🎉 QUAY SỐ MAY MẮN 🎉</h1>*/}

                <h1 style={{textAlign: "center"}}>
                    <span style={{color: "red"}}>{currentPrize?.name || "Đã hết giải"}</span>
                </h1>

                <div style={{display: "flex", justifyContent: "center", gap: "10px", marginTop: "25px"}}>
                    {slots.map((c, i) => (
                        <div
                            key={i}
                            style={{
                                width: "100px",
                                height: "140px",
                                background: "#d81b60",
                                color: "white",
                                borderRadius: "12px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "48px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                            }}
                        >
                            {c}
                        </div>
                    ))}
                </div>

                <div style={{textAlign: "center"}}>
                    {currentPrize && (
                        <button onClick={spin} disabled={spinning} style={buttonPrimary}>
                            🎲 QUAY SỐ
                        </button>
                    )}

                    <button onClick={resetAll} style={buttonSecondary}>
                        ♻ RESET & QUAY LẠI
                    </button>
                </div>
            </div>
        </div>
    );
}
