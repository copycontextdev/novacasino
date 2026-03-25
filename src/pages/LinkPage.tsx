import axios from "axios";
import { useState } from "react";

type TestResult = {
    status?: number;
    type?: string;
    ok?: boolean;
    error?: string;
    preview?: string;
};

export default function TestLink() {
    const [cbeId, setCbeId] = useState("FT26079C6KR381610399");
    const [boaId, setBoaId] = useState("hehzo3aayy2");
    const [telebirrId, setTelebirrId] = useState("DCM64W9150");

    const CBE_LINK = `https://apps.cbe.com.et:100/?id=${cbeId}`;
    const BOA_LINK = `https://mcnpkmnf81rz7s-0mxl8ql8p6yz8.pub.sfmc-content.com/${boaId}`;
    const TELEBIRR_LINK = `https://transactioninfo.ethiotelecom.et/receipt/${telebirrId}`;

    const [results, setResults] = useState<{
        cbe?: TestResult;
        boa?: TestResult;
        telebirr?: TestResult;
    }>({});

    const fetchTest = async (key: "cbe" | "boa" | "telebirr", url: string) => {
        try {
            // const receiptUrl = 'https://transactioninfo.ethiotelecom.et/receipt/DCM64W9150';
            // const proxyUrl = `https://api.allorigins.win{encodeURIComponent(receiptUrl)}`;
            // fetch(`https://api.allorigins.win{encodeURIComponent('https://transactioninfo.ethiotelecom.et/receipt/DCM64W9150')}`)
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log("Success! Data received:");
            //         console.log(data.contents.substring(0, 500)); // Prints the first 500 characters of the HTML
            //     })
            //     .catch(err => console.error("Proxy failed:", err));

            // // try {
            // //     const response = await axios.get(receiptUrl, {
            // //         headers: {
            // //             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            // //         }
            // //     });
            // //     console.log("REsponse", response)
            // // } catch (error) {
            // //     console.log("Error fetching receipt", error);
            // // }

            // return;
            const res = await fetch(url, { mode: 'same-origin' });

            let preview = "";
            try {
                const text = await res.text();
                preview = text.slice(0, 500);
            } catch {
                preview = "⚠️ Unable to read response body";
            }

            setResults((prev) => ({
                ...prev,
                [key]: {
                    status: res.status,
                    type: res.type,
                    ok: res.ok,
                    preview,
                },
            }));
        } catch (err: any) {
            setResults((prev) => ({
                ...prev,
                [key]: {
                    error: err?.message || "Unknown error",
                },
            }));
        }
    };

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif" }}>
            <h1>🔍 Bank Link Test Playground</h1>

            {/* CBE */}
            <section style={{ marginBottom: 30 }}>
                <h2>CBE</h2>
                <div style={{ marginBottom: 10 }}>
                    <strong>Link: </strong>
                    <a href={CBE_LINK} target="_blank" rel="noreferrer" style={{ color: "#00f" }}>
                        {CBE_LINK}
                    </a>
                </div>
                <input
                    value={cbeId}
                    onChange={(e) => setCbeId(e.target.value)}
                    style={{ width: "300px", marginRight: 10 }}
                    placeholder="Transaction ID"
                />
                <button onClick={() => fetchTest("cbe", CBE_LINK)}>
                    Test CBE
                </button>

                <pre style={boxStyle}>
                    {results.cbe
                        ? JSON.stringify(results.cbe, null, 2)
                        : "No result yet"}
                </pre>
            </section>

            {/* BOA */}
            <section style={{ marginBottom: 30 }}>
                <h2>BOA</h2>
                <div style={{ marginBottom: 10 }}>
                    <strong>Link: </strong>
                    <a href={BOA_LINK} target="_blank" rel="noreferrer" style={{ color: "#00f" }}>
                        {BOA_LINK}
                    </a>
                </div>
                <input
                    value={boaId}
                    onChange={(e) => setBoaId(e.target.value)}
                    style={{ width: "300px", marginRight: 10 }}
                    placeholder="Transaction ID"
                />
                <button onClick={() => fetchTest("boa", BOA_LINK)}>
                    Test BOA
                </button>

                <pre style={boxStyle}>
                    {results.boa
                        ? JSON.stringify(results.boa, null, 2)
                        : "No result yet"}
                </pre>
            </section>

            {/* Telebirr */}
            <section style={{ marginBottom: 30 }}>
                <h2>Telebirr</h2>
                <div style={{ marginBottom: 10 }}>
                    <strong>Link: </strong>
                    <a href={TELEBIRR_LINK} target="_blank" rel="noreferrer" style={{ color: "#00f" }}>
                        {TELEBIRR_LINK}
                    </a>
                </div>
                <input
                    value={telebirrId}
                    onChange={(e) => setTelebirrId(e.target.value)}
                    style={{ width: "300px", marginRight: 10 }}
                    placeholder="Transaction ID"
                />
                <button onClick={() => fetchTest("telebirr", TELEBIRR_LINK)}>
                    Test Telebirr
                </button>

                <pre style={boxStyle}>
                    {results.telebirr
                        ? JSON.stringify(results.telebirr, null, 2)
                        : "No result yet"}
                </pre>
            </section>
        </div>
    );
}

const boxStyle: React.CSSProperties = {
    marginTop: 15,
    padding: 10,
    background: "#111",
    color: "#0f0",
    maxHeight: 300,
    overflow: "auto",
    fontSize: 12,
};